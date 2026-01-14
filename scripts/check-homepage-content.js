const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function checkHomepageContent() {
  try {
    console.log("Vérification du contenu de la page d'accueil...\n")

    const content = await prisma.homePageContent.findFirst()

    if (!content) {
      console.log("❌ Aucun contenu trouvé dans la table homePageContent")
      console.log("\nCréation du contenu par défaut...")

      const newContent = await prisma.homePageContent.create({
        data: {},
      })

      console.log("✅ Contenu créé avec l'ID:", newContent.id)
      return
    }

    console.log("📄 Contenu trouvé:")
    console.log("─".repeat(60))
    console.log(`ID: ${content.id}`)
    console.log(`\n🏠 Section Gîte:`)
    console.log(`  - Titre: ${content.giteTitle || "(vide)"}`)
    console.log(`  - Description: ${content.giteDescription || "(vide)"}`)
    console.log(`  - Image: ${content.giteImage || "❌ AUCUNE IMAGE"}`)
    console.log(`  - Features: ${JSON.stringify(content.giteFeatures)}`)

    console.log(`\n🛍️ Section Boutique:`)
    console.log(`  - Titre: ${content.boutiqueTitle || "(vide)"}`)
    console.log(`  - Description: ${content.boutiqueDescription || "(vide)"}`)
    console.log(`  - Image: ${content.boutiqueImage || "❌ AUCUNE IMAGE"}`)
    console.log(`  - Features: ${JSON.stringify(content.boutiqueFeatures)}`)

    console.log(`\n🎯 Section Hero:`)
    console.log(`  - Titre: ${content.heroTitle || "(vide)"}`)
    console.log(`  - Sous-titre: ${content.heroSubtitle || "(vide)"}`)
    console.log(`  - Description: ${content.heroDescription || "(vide)"}`)

    console.log("─".repeat(60))

    if (!content.giteImage) {
      console.log("\n⚠️  L'image du gîte est manquante!")
      console.log("Vérifiez que l'upload a bien fonctionné dans le dashboard.")
    } else {
      console.log("\n✅ L'image du gîte est présente dans la base de données")
    }
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkHomepageContent()
