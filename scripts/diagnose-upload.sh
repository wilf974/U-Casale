#!/bin/bash

echo "🔍 Diagnostic de l'upload d'images"
echo "=================================="
echo ""

# 1. Vérifier les permissions du dossier uploads
echo "1️⃣ Vérification des permissions du dossier uploads dans le conteneur:"
docker exec ucasale_app ls -la /app/public/ 2>/dev/null | grep uploads || echo "❌ Dossier uploads introuvable"

echo ""
echo "2️⃣ Vérification du contenu du dossier uploads/general:"
docker exec ucasale_app ls -la /app/public/uploads/general/ 2>/dev/null || echo "❌ Dossier uploads/general introuvable"

echo ""
echo "3️⃣ Vérification des derniers logs d'upload:"
echo "Recherche de logs d'upload dans les dernières 100 lignes..."
docker logs ucasale_app --tail 100 2>&1 | grep -i "upload\|fichier\|image" || echo "❌ Aucun log d'upload trouvé"

echo ""
echo "4️⃣ Vérification de l'espace disque:"
df -h | grep -E "Filesystem|/var/lib/docker"

echo ""
echo "5️⃣ Test de création d'un fichier test dans le conteneur:"
docker exec ucasale_app sh -c "touch /app/public/uploads/test.txt && ls -la /app/public/uploads/test.txt && rm /app/public/uploads/test.txt" 2>&1

echo ""
echo "=================================="
echo "✅ Diagnostic terminé"
echo ""
echo "Si le dossier uploads n'existe pas, créez-le avec:"
echo "  docker exec ucasale_app mkdir -p /app/public/uploads/general"
echo "  docker exec ucasale_app chmod -R 755 /app/public/uploads"
