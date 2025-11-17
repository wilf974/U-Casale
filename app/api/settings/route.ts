import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// API publique pour récupérer les paramètres du site (version limitée)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      // Si pas de settings, retourner des valeurs par défaut
      return NextResponse.json({
        success: true,
        settings: {
          siteName: "U Casale",
          address: null,
          latitude: null,
          longitude: null,
          contactEmail: null,
          contactPhone: null,
        },
      })
    }

    // Retourner uniquement les informations publiques
    return NextResponse.json({
      success: true,
      settings: {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        address: settings.address,
        latitude: settings.latitude,
        longitude: settings.longitude,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        facebookUrl: settings.facebookUrl,
        instagramUrl: settings.instagramUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching public settings:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
