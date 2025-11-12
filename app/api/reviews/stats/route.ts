import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Get review statistics
export async function GET() {
  try {
    const [totalReviews, averageRating, ratingDistribution] = await Promise.all([
      prisma.review.count({
        where: { published: true },
      }),
      prisma.review.aggregate({
        where: { published: true },
        _avg: {
          rating: true,
        },
      }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { published: true },
        _count: {
          rating: true,
        },
      }),
    ])

    // Create rating distribution object
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    ratingDistribution.forEach((item) => {
      distribution[item.rating as keyof typeof distribution] = item._count.rating
    })

    return NextResponse.json({
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      distribution,
    })
  } catch (error) {
    console.error("Error fetching review stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
