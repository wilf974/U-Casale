import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// Admin: Update review
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { published, reported, adminResponse } = body

    const updateData: any = {}

    if (typeof published === "boolean") {
      updateData.published = published
    }

    if (typeof reported === "boolean") {
      updateData.reported = reported
    }

    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse
      if (adminResponse) {
        updateData.respondedAt = new Date()
      }
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Admin: Delete review
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.review.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
