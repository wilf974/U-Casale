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

    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ promoCode })
  } catch (error) {
    console.error("Error fetching promo code:", error)
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
    const {
      code,
      type,
      value,
      minOrderAmount,
      maxUses,
      validFrom,
      validUntil,
      active,
    } = body

    // Check if promo code exists
    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { id },
    })

    if (!existingPromoCode) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 }
      )
    }

    // If code is being changed, check it doesn't already exist
    if (code && code.toUpperCase() !== existingPromoCode.code) {
      const codeExists = await prisma.promoCode.findUnique({
        where: { code: code.trim().toUpperCase() },
      })

      if (codeExists) {
        return NextResponse.json(
          { error: "A promo code with this code already exists" },
          { status: 400 }
        )
      }
    }

    // Validation
    if (type && !["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json(
        { error: "Valid type is required (PERCENTAGE or FIXED)" },
        { status: 400 }
      )
    }

    if (value !== undefined && value <= 0) {
      return NextResponse.json(
        { error: "Valid value is required" },
        { status: 400 }
      )
    }

    if (type === "PERCENTAGE" && value !== undefined && value > 100) {
      return NextResponse.json(
        { error: "Percentage value cannot exceed 100" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (code !== undefined) updateData.code = code.trim().toUpperCase()
    if (type !== undefined) updateData.type = type
    if (value !== undefined) updateData.value = parseFloat(value)
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount ? parseFloat(minOrderAmount) : null
    if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null
    if (validFrom !== undefined) updateData.validFrom = validFrom ? new Date(validFrom) : null
    if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null
    if (active !== undefined) updateData.active = active

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      promoCode,
    })
  } catch (error) {
    console.error("Error updating promo code:", error)
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

    // Check if promo code exists
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 }
      )
    }

    await prisma.promoCode.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Promo code deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting promo code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
