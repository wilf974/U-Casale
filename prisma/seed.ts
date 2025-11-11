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

  // Create default gite configuration
  const giteConfig = await prisma.giteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      pricePerNight: 150,
      maxGuests: 6,
      minimumStay: 2,
      blockedDates: [],
      cleaningFee: 50,
      taxRate: 0.10,
      description: "Gîte authentique au cœur de la Corse",
      rules: "Non-fumeur. Animaux acceptés sur demande.",
    },
  })

  console.log("✅ Gite config created")

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
