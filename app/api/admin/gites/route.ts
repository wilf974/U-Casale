import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// Admin: Get all gites
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const available = searchParams.get("available")

    const where: any = {}

    if (available !== null) {
      where.available = available === "true"
    }

    const gites = await prisma.gite.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({ gites })
  } catch (error) {
    console.error("Error fetching gites:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Admin: Create gite
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Validate required fields
    if (!name || !slug || !maxGuests || !pricePerNight) {
      return NextResponse.json(
        { error: "Nom, slug, capacité et prix sont requis" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.gite.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Ce slug existe déjà" },
        { status: 400 }
      )
    }

    const gite = await prisma.gite.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        maxGuests: parseInt(maxGuests),
        bedrooms: bedrooms ? parseInt(bedrooms) : 1,
        beds: beds ? parseInt(beds) : 1,
        bathrooms: bathrooms ? parseInt(bathrooms) : 1,
        pricePerNight: parseFloat(pricePerNight),
        cleaningFee: cleaningFee ? parseFloat(cleaningFee) : 0,
        minimumStay: minimumStay ? parseInt(minimumStay) : 1,
        seasonalPricing,
        address,
        city,
        postalCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: images || [],
        featuredImage,
        virtualTourUrl,
        amenities,
        equipment,
        available: available !== undefined ? available : true,
        blockedDates: blockedDates || [],
        rules,
        checkInTime: checkInTime || "15:00",
        checkOutTime: checkOutTime || "11:00",
        metaTitle,
        metaDescription,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        featured: featured || false,
      },
    })

    return NextResponse.json({ success: true, gite })
  } catch (error) {
    console.error("Error creating gite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
