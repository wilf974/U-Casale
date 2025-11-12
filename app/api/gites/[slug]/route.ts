import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * API publique pour récupérer un gîte par son slug
 * GET /api/gites/[slug] - Détails d'un gîte
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const gite = await prisma.gite.findUnique({
      where: { slug },
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
        equipment: true,
        available: true,
        blockedDates: true,
        rules: true,
        checkInTime: true,
        checkOutTime: true,
        metaTitle: true,
        metaDescription: true,
        displayOrder: true,
        featured: true,
      },
    })

    if (!gite) {
      return NextResponse.json(
        { success: false, error: "Gîte not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, gite })
  } catch (error) {
    console.error("Error fetching gite:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch gite" },
      { status: 500 }
    )
  }
}
