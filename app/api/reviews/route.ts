import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Get public reviews
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") // "order" or "reservation"
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")

    const where: any = {
      published: true,
    }

    if (type === "order") {
      where.orderId = { not: null }
    } else if (type === "reservation") {
      where.reservationId = { not: null }
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Submit a new review
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerId, orderId, reservationId, rating, title, comment, images } = body

    // Validate required fields
    if (!customerId || !rating || !comment) {
      return NextResponse.json(
        { error: "customerId, rating et comment sont requis" },
        { status: 400 }
      )
    }

    // Must have either orderId or reservationId
    if (!orderId && !reservationId) {
      return NextResponse.json(
        { error: "orderId ou reservationId requis" },
        { status: 400 }
      )
    }

    // Verify customer owns the order/reservation
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerId,
          paymentStatus: "PAID",
        },
      })

      if (!order) {
        return NextResponse.json(
          { error: "Commande introuvable ou non payée" },
          { status: 404 }
        )
      }

      // Check if already reviewed
      const existingReview = await prisma.review.findFirst({
        where: { orderId, customerId },
      })

      if (existingReview) {
        return NextResponse.json(
          { error: "Vous avez déjà évalué cette commande" },
          { status: 400 }
        )
      }
    }

    if (reservationId) {
      const reservation = await prisma.reservation.findFirst({
        where: {
          id: reservationId,
          customerId,
          paymentStatus: "PAID",
        },
      })

      if (!reservation) {
        return NextResponse.json(
          { error: "Réservation introuvable ou non payée" },
          { status: 404 }
        )
      }

      // Check if already reviewed
      const existingReview = await prisma.review.findFirst({
        where: { reservationId, customerId },
      })

      if (existingReview) {
        return NextResponse.json(
          { error: "Vous avez déjà évalué cette réservation" },
          { status: 400 }
        )
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        customerId,
        orderId,
        reservationId,
        rating: Math.max(1, Math.min(5, rating)), // Clamp between 1-5
        title,
        comment,
        images: images || [],
        verified: true, // Auto-verified since linked to order/reservation
      },
    })

    // Award loyalty points for review (if loyalty system is active)
    try {
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { customerId },
      })

      if (loyaltyAccount) {
        await prisma.loyaltyTransaction.create({
          data: {
            accountId: loyaltyAccount.id,
            type: "EARNED_REVIEW",
            points: 50, // 50 points per review
            description: "Avis publié",
            orderId,
            reservationId,
          },
        })

        await prisma.loyaltyAccount.update({
          where: { id: loyaltyAccount.id },
          data: {
            points: { increment: 50 },
            totalEarned: { increment: 50 },
          },
        })
      }
    } catch (loyaltyError) {
      // Don't fail the review if loyalty fails
      console.error("Error awarding loyalty points:", loyaltyError)
    }

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    )
  }
}
