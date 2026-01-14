const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function checkGiteImages() {
  try {
    console.log("Recherche des gîtes...")

    const gites = await prisma.gite.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        featuredImage: true,
      },
    })

    console.log(`\nTrouvé ${gites.length} gîte(s):\n`)

    gites.forEach((gite) => {
      console.log("─".repeat(60))
      console.log(`Nom: ${gite.name}`)
      console.log(`Slug: ${gite.slug}`)
      console.log(`ID: ${gite.id}`)
      console.log(`Featured Image: ${gite.featuredImage || "(aucune)"}`)
      console.log(`Images (${gite.images.length}):`)
      if (gite.images.length > 0) {
        gite.images.forEach((img, index) => {
          console.log(`  ${index + 1}. ${img}`)
        })
      } else {
        console.log("  ⚠️  Aucune image")
      }
      console.log()
    })

    console.log("─".repeat(60))
    console.log("\n✅ Vérification terminée\n")
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGiteImages()
