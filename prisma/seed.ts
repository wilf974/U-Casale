import { PrismaClient, UserRole } from "@prisma/client"
import { hashPassword } from "../lib/password"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create default admin user
  const adminEmail = "admin@ucasale.com"
  const adminPassword = await hashPassword("admin123")

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrateur",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log("✅ Admin user created:", admin.email)

  // Create global gite configuration (settings globaux)
  const giteConfig = await prisma.giteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      taxRate: 0.10,
      currency: "EUR",
      defaultCheckIn: "15:00",
      defaultCheckOut: "11:00",
      bookingEmail: "reservations@ucasale.com",
      termsAndConditions: "Conditions générales de location disponibles sur demande.",
      cancellationPolicy: "Annulation gratuite jusqu'à 7 jours avant l'arrivée.",
    },
  })

  console.log("✅ Gite config created")

  // Create default gite (propriété individuelle)
  const defaultGite = await prisma.gite.upsert({
    where: { slug: "u-casale-piscia-rossa" },
    update: {},
    create: {
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

  console.log("✅ Default gite created:", defaultGite.name)

  // Create default site settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "U Casale - Seni Production",
      siteDescription: "Gîte et produits artisanaux corses à Piscia Rossa",
      contactEmail: "contact@ucasale.com",
      contactPhone: "+33 X XX XX XX XX",
      address: "Piscia Rossa, Corse",
      maintenanceMode: false,
    },
  })

  console.log("✅ Site settings created")

  // Create example category
  const category = await prisma.category.upsert({
    where: { slug: "vins-corses" },
    update: {},
    create: {
      slug: "vins-corses",
      name: "Vins Corses",
      description: "Sélection de vins corses de notre production",
      published: true,
      displayOrder: 1,
    },
  })

  console.log("✅ Example category created")

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
