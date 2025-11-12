import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// Admin: Get single gite
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const gite = await prisma.gite.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
          },
          orderBy: {
            checkIn: "asc",
          },
        },
      },
    })

    if (!gite) {
      return NextResponse.json({ error: "Gîte not found" }, { status: 404 })
    }

    return NextResponse.json({ gite })
  } catch (error) {
    console.error("Error fetching gite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Admin: Update gite
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

    const {
      name,
      slug,
      description,
      shortDescription,
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      pricePerNight,
      cleaningFee,
      minimumStay,
      seasonalPricing,
      address,
      city,
      postalCode,
      latitude,
      longitude,
      images,
      featuredImage,
      virtualTourUrl,
      amenities,
      equipment,
      available,
      blockedDates,
      rules,
      checkInTime,
      checkOutTime,
      metaTitle,
      metaDescription,
      displayOrder,
      featured,
    } = body

    // Check if slug is taken by another gite
    if (slug) {
      const existing = await prisma.gite.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: "Ce slug existe déjà" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription
    if (maxGuests !== undefined) updateData.maxGuests = parseInt(maxGuests)
    if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms)
    if (beds !== undefined) updateData.beds = parseInt(beds)
    if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms)
    if (pricePerNight !== undefined) updateData.pricePerNight = parseFloat(pricePerNight)
    if (cleaningFee !== undefined) updateData.cleaningFee = parseFloat(cleaningFee)
    if (minimumStay !== undefined) updateData.minimumStay = parseInt(minimumStay)
    if (seasonalPricing !== undefined) updateData.seasonalPricing = seasonalPricing
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (postalCode !== undefined) updateData.postalCode = postalCode
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude) : null
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude) : null
    if (images !== undefined) updateData.images = images
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage
    if (virtualTourUrl !== undefined) updateData.virtualTourUrl = virtualTourUrl
    if (amenities !== undefined) updateData.amenities = amenities
    if (equipment !== undefined) updateData.equipment = equipment
    if (available !== undefined) updateData.available = available
    if (blockedDates !== undefined) updateData.blockedDates = blockedDates
    if (rules !== undefined) updateData.rules = rules
    if (checkInTime !== undefined) updateData.checkInTime = checkInTime
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder)
    if (featured !== undefined) updateData.featured = featured

    const gite = await prisma.gite.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, gite })
  } catch (error) {
    console.error("Error updating gite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Admin: Delete gite
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

    // Check if gite has reservations
    const reservationCount = await prisma.reservation.count({
      where: { giteId: id },
    })

    if (reservationCount > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer un gîte avec des réservations" },
        { status: 400 }
      )
    }

    await prisma.gite.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
