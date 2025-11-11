import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    })

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ faq })
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { question, answer, category, displayOrder, published } = body

    // Check if FAQ exists
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id },
    })

    if (!existingFAQ) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404 }
      )
    }

    // Validation
    if (question !== undefined && question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question cannot be empty" },
        { status: 400 }
      )
    }

    if (answer !== undefined && answer.trim().length === 0) {
      return NextResponse.json(
        { error: "Answer cannot be empty" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (question !== undefined) updateData.question = question.trim()
    if (answer !== undefined) updateData.answer = answer.trim()
    if (category !== undefined) updateData.category = category ? category.trim() : null
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder)
    if (published !== undefined) updateData.published = published

    const faq = await prisma.fAQ.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      faq,
    })
  } catch (error) {
    console.error("Error updating FAQ:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if FAQ exists
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    })

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ not found" },
        { status: 404 }
      )
    }

    await prisma.fAQ.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
