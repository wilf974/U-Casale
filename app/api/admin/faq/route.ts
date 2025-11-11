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
    const category = searchParams.get("category")
    const published = searchParams.get("published")

    const where: any = {}
    if (category && category !== "all") {
      where.category = category
    }
    if (published === "true") {
      where.published = true
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error("Error fetching FAQs:", error)
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
    const { question, answer, category, displayOrder, published } = body

    // Validation
    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      )
    }

    if (!answer || answer.trim().length === 0) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 }
      )
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category ? category.trim() : null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0,
        published: published !== undefined ? published : true,
      },
    })

    return NextResponse.json({
      success: true,
      faq,
    })
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
