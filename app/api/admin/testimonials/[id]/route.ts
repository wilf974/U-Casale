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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error("Error fetching testimonial:", error)
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
    const { customerName, content, rating, type, verified, published, displayOrder } = body

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      )
    }

    // Validation
    if (customerName !== undefined && customerName.trim().length === 0) {
      return NextResponse.json(
        { error: "Customer name cannot be empty" },
        { status: 400 }
      )
    }

    if (content !== undefined && content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      )
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (customerName !== undefined) updateData.customerName = customerName.trim()
    if (content !== undefined) updateData.content = content.trim()
    if (rating !== undefined) updateData.rating = parseInt(rating)
    if (type !== undefined) updateData.type = type
    if (verified !== undefined) updateData.verified = verified
    if (published !== undefined) updateData.published = published
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder)

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.error("Error updating testimonial:", error)
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

    // Check if testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      )
    }

    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
