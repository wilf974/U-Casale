#!/bin/sh
set -e

# Créer les dossiers uploads si ils n'existent pas
mkdir -p /app/public/uploads/gites
mkdir -p /app/public/uploads/products
mkdir -p /app/public/uploads/general

# S'assurer que les permissions sont correctes
# Dossiers: 755 (rwxr-xr-x) pour permettre à nginx de traverser
# Fichiers: seront créés avec 644 (rw-r--r--) par l'API
chmod -R 755 /app/public/uploads

# S'assurer que nextjs possède les fichiers
chown -R nextjs:nodejs /app/public/uploads

echo "📁 Dossiers uploads créés avec succès"
echo "📁 Permissions configurées (755 pour dossiers) avec propriétaire nextjs:nodejs"

# Basculer vers l'utilisateur nextjs et lancer l'application
exec su-exec nextjs node server.js
