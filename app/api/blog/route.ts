import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Public: Get published blog posts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")

    const where: any = {
      published: true,
    }

    if (category) {
      where.category = category
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          author: true,
          category: true,
          tags: true,
          publishedAt: true,
          viewCount: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    // Get categories with post counts
    const categories = await prisma.blogPost.groupBy({
      by: ["category"],
      where: { published: true, category: { not: null } },
      _count: { category: true },
    })

    return NextResponse.json({
      posts,
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
