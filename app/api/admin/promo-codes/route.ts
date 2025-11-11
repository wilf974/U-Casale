import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ promoCodes })
  } catch (error) {
    console.error("Error fetching promo codes:", error)
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

    // Validation
    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      )
    }

    if (!type || !["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json(
        { error: "Valid type is required (PERCENTAGE or FIXED)" },
        { status: 400 }
      )
    }

    if (value === undefined || value <= 0) {
      return NextResponse.json(
        { error: "Valid value is required" },
        { status: 400 }
      )
    }

    if (type === "PERCENTAGE" && value > 100) {
      return NextResponse.json(
        { error: "Percentage value cannot exceed 100" },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCode = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    if (existingCode) {
      return NextResponse.json(
        { error: "A promo code with this code already exists" },
        { status: 400 }
      )
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        currentUses: 0,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        active: active === true,
      },
    })

    return NextResponse.json({
      success: true,
      promoCode,
    })
  } catch (error) {
    console.error("Error creating promo code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
