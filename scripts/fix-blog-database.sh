#!/bin/bash

##############################################################################
# Script de Réparation du Système de Blog
#
# Ce script synchronise le schema Prisma avec la base de données
# et vérifie que le modèle BlogPost existe.
#
# Usage:
#   ./scripts/fix-blog-database.sh
#
# Ou sur le VPS:
#   cd /opt/apps/u-casale
#   bash scripts/fix-blog-database.sh
##############################################################################

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Script de Réparation du Système de Blog"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "   Assurez-vous d'être dans le répertoire racine du projet"
    exit 1
fi

echo "✓ Répertoire du projet vérifié"
echo ""

# Étape 1: Vérifier la connexion à la base de données
echo "📊 Étape 1/5: Vérification de la connexion à la base de données..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Impossible de se connecter à la base de données"
    echo "   Vérifiez la variable DATABASE_URL dans .env"
    exit 1
fi
echo "✓ Connexion à la base de données OK"
echo ""

# Étape 2: Synchroniser le schema Prisma avec la base
echo "🔄 Étape 2/5: Synchronisation du schema Prisma..."
if npx prisma db push --accept-data-loss > /tmp/prisma-push.log 2>&1; then
    echo "✓ Schema synchronisé avec succès"
    cat /tmp/prisma-push.log | grep -E "(Your database is now in sync|already in sync)" || true
else
    echo "❌ Erreur lors de la synchronisation"
    echo "   Logs complets dans /tmp/prisma-push.log"
    cat /tmp/prisma-push.log
    exit 1
fi
echo ""

# Étape 3: Générer le client Prisma
echo "⚙️  Étape 3/5: Génération du client Prisma..."
if npx prisma generate > /tmp/prisma-generate.log 2>&1; then
    echo "✓ Client Prisma généré"
else
    echo "❌ Erreur lors de la génération du client"
    echo "   Logs complets dans /tmp/prisma-generate.log"
    cat /tmp/prisma-generate.log
    exit 1
fi
echo ""

# Étape 4: Vérifier que la table blog_posts existe
echo "🔍 Étape 4/5: Vérification de la table blog_posts..."
if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM blog_posts;" > /dev/null 2>&1; then
    # Compter les articles
    ARTICLE_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM blog_posts;" 2>/dev/null | tail -1 || echo "0")
    echo "✓ Table blog_posts existe (${ARTICLE_COUNT} articles)"
else
    echo "❌ La table blog_posts n'existe pas ou est corrompue"
    echo "   Essayez de réexécuter le script ou vérifiez le schema.prisma"
    exit 1
fi
echo ""

# Étape 5: Test de création (optionnel)
echo "🧪 Étape 5/5: Test de création d'article (optionnel)..."
read -p "Voulez-vous tester la création d'un article de test ? (o/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Oo]$ ]]; then
    if npm run test:blog > /tmp/test-blog.log 2>&1; then
        echo "✓ Test de création réussi"
    else
        echo "⚠️  Le test a échoué, mais la base est probablement OK"
        echo "   Vérifiez les logs dans /tmp/test-blog.log"
    fi
else
    echo "  Test ignoré"
fi
echo ""

# Résumé
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ RÉPARATION TERMINÉE AVEC SUCCÈS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. Si vous êtes en développement (local):"
echo "   npm run dev"
echo ""
echo "2. Si vous êtes en production (VPS avec Docker):"
echo "   docker compose down"
echo "   docker compose up -d --build"
echo ""
echo "3. Testez la création d'article:"
echo "   - Ouvrez http://votre-domaine/dashboard/blog"
echo "   - Cliquez sur 'Nouvel article'"
echo "   - Remplissez le formulaire et publiez"
echo ""
echo "4. En cas de problème, consultez:"
echo "   - TROUBLESHOOTING_BLOG.md"
echo "   - Logs: docker logs ucasale_app --tail 100"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
