import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Public: Get single blog post by slug
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        viewCount: { increment: 1 },
      },
    })

    // Get related posts (same category, limit 3)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        NOT: { id: post.id },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
      },
      take: 3,
      orderBy: {
        publishedAt: "desc",
      },
    })

    return NextResponse.json({
      post: {
        ...post,
        viewCount: post.viewCount + 1, // Return updated count
      },
      relatedPosts,
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
