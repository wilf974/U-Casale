#!/usr/bin/env tsx

/**
 * Script de diagnostic pour le système de blog
 * Vérifie la connexion à la base de données et teste les opérations CRUD
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function testBlog() {
  console.log("🔍 Diagnostic du système de blog\n")

  try {
    // Test 1: Connexion à la base de données
    console.log("✓ Test 1: Connexion à la base de données...")
    await prisma.$connect()
    console.log("  ✓ Connecté à la base de données\n")

    // Test 2: Vérifier si la table blog_posts existe
    console.log("✓ Test 2: Vérification de la table blog_posts...")
    try {
      const count = await prisma.blogPost.count()
      console.log(`  ✓ Table blog_posts existe (${count} articles)\n`)
    } catch (error: any) {
      console.error("  ✗ Erreur: La table blog_posts n'existe pas")
      console.error(`  Détails: ${error.message}\n`)
      return
    }

    // Test 3: Lister tous les articles existants
    console.log("✓ Test 3: Liste des articles existants...")
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    if (posts.length === 0) {
      console.log("  ℹ Aucun article trouvé\n")
    } else {
      console.log(`  ✓ ${posts.length} article(s) trouvé(s):`)
      posts.forEach((post, i) => {
        console.log(`    ${i + 1}. "${post.title}" (${post.slug})`)
        console.log(`       ID: ${post.id}`)
        console.log(`       Publié: ${post.published ? "Oui" : "Non"}`)
        console.log(`       Créé: ${post.createdAt.toISOString()}\n`)
      })
    }

    // Test 4: Test de création d'article
    console.log("✓ Test 4: Test de création d'un article de test...")
    const testSlug = `test-diagnostic-${Date.now()}`

    try {
      const testPost = await prisma.blogPost.create({
        data: {
          title: "Article de test - Diagnostic",
          slug: testSlug,
          content: "Ceci est un article de test créé par le script de diagnostic.",
          excerpt: "Test diagnostic du système de blog",
          author: "U Casale",
          category: "actualites",
          tags: ["test", "diagnostic"],
          published: false,
        },
      })

      console.log("  ✓ Article de test créé avec succès")
      console.log(`    ID: ${testPost.id}`)
      console.log(`    Title: ${testPost.title}`)
      console.log(`    Slug: ${testPost.slug}\n`)

      // Test 5: Test de lecture
      console.log("✓ Test 5: Test de lecture...")
      const readPost = await prisma.blogPost.findUnique({
        where: { id: testPost.id },
      })

      if (readPost) {
        console.log("  ✓ Article lu avec succès\n")
      } else {
        console.error("  ✗ Erreur: Impossible de lire l'article\n")
      }

      // Test 6: Test de mise à jour
      console.log("✓ Test 6: Test de mise à jour...")
      const updatedPost = await prisma.blogPost.update({
        where: { id: testPost.id },
        data: {
          published: true,
          publishedAt: new Date(),
        },
      })

      console.log("  ✓ Article mis à jour avec succès")
      console.log(`    Publié: ${updatedPost.published}\n`)

      // Test 7: Test de suppression
      console.log("✓ Test 7: Test de suppression...")
      await prisma.blogPost.delete({
        where: { id: testPost.id },
      })

      console.log("  ✓ Article supprimé avec succès\n")

    } catch (error: any) {
      console.error("  ✗ Erreur lors des tests CRUD")
      console.error(`  Détails: ${error.message}\n`)
      throw error
    }

    // Résumé
    console.log("═══════════════════════════════════════")
    console.log("✅ DIAGNOSTIC COMPLET")
    console.log("═══════════════════════════════════════")
    console.log("Tous les tests sont passés avec succès!")
    console.log("Le système de blog fonctionne correctement.\n")
    console.log("Si vous ne pouvez toujours pas créer d'articles,")
    console.log("le problème vient probablement de:")
    console.log("  1. L'authentification (vérifiez que vous êtes connecté)")
    console.log("  2. Le client Prisma (npx prisma generate)")
    console.log("  3. Le serveur Next.js (redémarrage nécessaire)\n")

  } catch (error: any) {
    console.error("\n❌ ERREUR FATALE")
    console.error("═══════════════════════════════════════")
    console.error("Le diagnostic a échoué:")
    console.error(error.message)
    console.error("\nStack trace:")
    console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testBlog()
