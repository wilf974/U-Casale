#!/bin/sh
set -e

# Créer les dossiers uploads si ils n'existent pas
mkdir -p /app/public/uploads/gites
mkdir -p /app/public/uploads/products
mkdir -p /app/public/uploads/general

# S'assurer que les permissions sont correctes
# Utiliser chmod 777 pour permettre à tous les utilisateurs d'écrire et nginx de lire
chmod -R 777 /app/public/uploads

# S'assurer que nextjs possède les fichiers
chown -R nextjs:nodejs /app/public/uploads

echo "📁 Dossiers uploads créés avec succès"
echo "📁 Permissions configurées (777) avec propriétaire nextjs:nodejs"

# Basculer vers l'utilisateur nextjs et lancer l'application
exec su-exec nextjs node server.js
