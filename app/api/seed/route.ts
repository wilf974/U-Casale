import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  try {
    // Vérifier si des utilisateurs existent déjà
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json(
        { message: "Database already seeded" },
        { status: 400 }
      )
    }

    // Create default admin user
    const adminEmail = "admin@ucasale.com"
    const adminPassword = await hashPassword("admin123")

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Administrateur",
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    })

    // Create global gite configuration (settings globaux)
    const giteConfig = await prisma.giteConfig.create({
      data: {
        id: "default",
        taxRate: 0.1,
        currency: "EUR",
        defaultCheckIn: "15:00",
        defaultCheckOut: "11:00",
        bookingEmail: "reservations@ucasale.com",
        termsAndConditions: "Conditions générales de location disponibles sur demande.",
        cancellationPolicy: "Annulation gratuite jusqu'à 7 jours avant l'arrivée.",
      },
    })

    // Create default gite (propriété individuelle)
    const defaultGite = await prisma.gite.create({
      data: {
        slug: "u-casale-piscia-rossa",
        name: "U Casale",
        description: "Gîte authentique au cœur de la Corse, situé à Piscia Rossa. Profitez d'une vue imprenable sur le maquis corse et les montagnes environnantes.",
        shortDescription: "Gîte de caractère pour 6 personnes à Piscia Rossa",
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        pricePerNight: 150,
        cleaningFee: 50,
        minimumStay: 2,
        address: "Piscia Rossa",
        city: "Afa",
        postalCode: "20167",
        latitude: 41.998500,
        longitude: 8.781972,
        images: [],
        amenities: {
          wifi: true,
          parking: true,
          airConditioning: true,
          kitchen: true,
          washingMachine: true,
          tv: true,
          terrace: true,
          garden: true,
        },
        available: true,
        blockedDates: [],
        rules: "Non-fumeur. Animaux acceptés sur demande. Merci de respecter le calme des lieux.",
        checkInTime: "15:00",
        checkOutTime: "11:00",
        displayOrder: 1,
        featured: true,
      },
    })

    // Create default site settings
    const siteSettings = await prisma.siteSettings.create({
      data: {
        id: "default",
        siteName: "U Casale - Seni Production",
        siteDescription: "Gîte et produits artisanaux corses à Piscia Rossa",
        contactEmail: "contact@ucasale.com",
        contactPhone: "+33 X XX XX XX XX",
        address: "Piscia Rossa, Corse",
        maintenanceMode: false,
      },
    })

    // Create example category
    const category = await prisma.category.create({
      data: {
        slug: "vins-corses",
        name: "Vins Corses",
        description: "Sélection de vins corses de notre production",
        published: true,
        displayOrder: 1,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        admin: { email: admin.email },
        giteConfig: { id: giteConfig.id },
        defaultGite: { slug: defaultGite.slug, name: defaultGite.name },
        siteSettings: { id: siteSettings.id },
        category: { slug: category.slug },
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    )
  }
}
