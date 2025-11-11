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

    const config = await prisma.giteConfig.findFirst({
      where: { id: "default" },
    })

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error("Error fetching gite config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
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
      pricePerNight,
      minimumStay,
      maxGuests,
      cleaningFee,
      taxRate,
      blockedDates,
    } = body

    // Validation
    if (pricePerNight !== undefined && (pricePerNight < 0 || isNaN(pricePerNight))) {
      return NextResponse.json(
        { error: "Invalid price per night" },
        { status: 400 }
      )
    }

    if (minimumStay !== undefined && (minimumStay < 1 || isNaN(minimumStay))) {
      return NextResponse.json(
        { error: "Minimum stay must be at least 1 night" },
        { status: 400 }
      )
    }

    if (maxGuests !== undefined && (maxGuests < 1 || isNaN(maxGuests))) {
      return NextResponse.json(
        { error: "Max guests must be at least 1" },
        { status: 400 }
      )
    }

    if (cleaningFee !== undefined && (cleaningFee < 0 || isNaN(cleaningFee))) {
      return NextResponse.json(
        { error: "Invalid cleaning fee" },
        { status: 400 }
      )
    }

    if (taxRate !== undefined && (taxRate < 0 || taxRate > 1 || isNaN(taxRate))) {
      return NextResponse.json(
        { error: "Tax rate must be between 0 and 1" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (pricePerNight !== undefined) updateData.pricePerNight = pricePerNight
    if (minimumStay !== undefined) updateData.minimumStay = minimumStay
    if (maxGuests !== undefined) updateData.maxGuests = maxGuests
    if (cleaningFee !== undefined) updateData.cleaningFee = cleaningFee
    if (taxRate !== undefined) updateData.taxRate = taxRate
    if (blockedDates !== undefined) {
      // Convert string dates to Date objects
      updateData.blockedDates = blockedDates.map((date: string) => new Date(date))
    }

    const config = await prisma.giteConfig.update({
      where: { id: "default" },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      config,
    })
  } catch (error) {
    console.error("Error updating gite config:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
