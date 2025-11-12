import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// Admin: Get all reviews
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")
    const reported = searchParams.get("reported")

    const where: any = {}

    if (published !== null) {
      where.published = published === "true"
    }

    if (reported === "true") {
      where.reported = true
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
        reservation: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
