import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * API publique pour récupérer les gîtes disponibles
 * GET /api/gites - Liste des gîtes disponibles
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const availableOnly = searchParams.get("available") !== "false"

    const where: any = {}
    if (availableOnly) {
      where.available = true
    }

    const gites = await prisma.gite.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        shortDescription: true,
        maxGuests: true,
        bedrooms: true,
        beds: true,
        bathrooms: true,
        pricePerNight: true,
        cleaningFee: true,
        minimumStay: true,
        address: true,
        city: true,
        postalCode: true,
        latitude: true,
        longitude: true,
        images: true,
        featuredImage: true,
        virtualTourUrl: true,
        amenities: true,
        available: true,
        rules: true,
        checkInTime: true,
        checkOutTime: true,
        metaTitle: true,
        metaDescription: true,
        displayOrder: true,
        featured: true,
      },
    })

    return NextResponse.json({ success: true, gites })
  } catch (error) {
    console.error("Error fetching gites:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch gites" },
      { status: 500 }
    )
  }
}
