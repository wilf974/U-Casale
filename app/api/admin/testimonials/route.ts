import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const published = searchParams.get("published")
    const verified = searchParams.get("verified")

    const where: any = {}
    if (type && type !== "all") {
      where.type = type
    }
    if (published === "true") {
      where.published = true
    }
    if (verified === "true") {
      where.verified = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { customerName, content, rating, type, verified, published, displayOrder } = body

    // Validation
    if (!customerName || customerName.trim().length === 0) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: customerName.trim(),
        content: content.trim(),
        rating: rating !== undefined ? parseInt(rating) : 5,
        type: type || "gite",
        verified: verified !== undefined ? verified : false,
        published: published !== undefined ? published : true,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
      },
    })

    return NextResponse.json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
