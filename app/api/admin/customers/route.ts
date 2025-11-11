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
    const search = searchParams.get("search")

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ]
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            reservations: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
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
    const { email, firstName, lastName, phone, address, city, postalCode, country } = body

    // Validation
    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!firstName || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      )
    }

    if (!lastName || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: email.trim() },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: "A customer with this email already exists" },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone ? phone.trim() : null,
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        postalCode: postalCode ? postalCode.trim() : null,
        country: country ? country.trim() : null,
      },
    })

    return NextResponse.json({
      success: true,
      customer,
    })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
