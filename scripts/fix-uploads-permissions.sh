#!/bin/bash

echo "🔧 Correction des permissions pour l'upload d'images"
echo "===================================================="
echo ""

# 1. Créer le dossier uploads s'il n'existe pas
echo "1️⃣ Création du dossier uploads dans le conteneur..."
docker exec ucasale_app mkdir -p /app/public/uploads/general
docker exec ucasale_app mkdir -p /app/public/uploads/gites
docker exec ucasale_app mkdir -p /app/public/uploads/products

# 2. Définir les bonnes permissions
echo "2️⃣ Configuration des permissions (755 pour dossiers, 644 pour fichiers)..."
docker exec ucasale_app chmod -R 755 /app/public/uploads

# 3. Vérifier que ça fonctionne
echo "3️⃣ Vérification des permissions..."
docker exec ucasale_app ls -la /app/public/ | grep uploads
docker exec ucasale_app ls -la /app/public/uploads/

# 4. Test de création d'un fichier
echo ""
echo "4️⃣ Test de création d'un fichier..."
docker exec ucasale_app sh -c "echo 'test' > /app/public/uploads/test.txt && cat /app/public/uploads/test.txt && rm /app/public/uploads/test.txt"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Les permissions sont correctement configurées!"
    echo ""
    echo "Vous pouvez maintenant réessayer d'uploader une image."
else
    echo ""
    echo "❌ Erreur lors de la configuration des permissions"
    echo "Vérifiez les logs du conteneur avec:"
    echo "  docker logs ucasale_app --tail 50"
fi

echo ""
echo "===================================================="
