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

    // Create default gite configuration
    const giteConfig = await prisma.giteConfig.create({
      data: {
        id: "default",
        pricePerNight: 150,
        maxGuests: 6,
        minimumStay: 2,
        blockedDates: [],
        cleaningFee: 50,
        taxRate: 0.1,
        description: "Gîte authentique au cœur de la Corse",
        rules: "Non-fumeur. Animaux acceptés sur demande.",
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
