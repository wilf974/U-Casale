# Scripts de Maintenance U Casale

Ce dossier contient les scripts utilitaires pour la maintenance et le diagnostic du projet U Casale.

---

## 📋 Scripts Disponibles

### 1. **fix-blog-database.sh** - Réparation du Système de Blog

Synchronise le schema Prisma avec la base de données et vérifie que le système de blog fonctionne.

**Usage**:
```bash
# En local
bash scripts/fix-blog-database.sh

# Sur le VPS
cd /opt/apps/u-casale
bash scripts/fix-blog-database.sh
```

**Ce que fait le script**:
1. Vérifie la connexion à la base de données
2. Synchronise le schema Prisma (`prisma db push`)
3. Génère le client Prisma (`prisma generate`)
4. Vérifie l'existence de la table `blog_posts`
5. Propose un test de création d'article (optionnel)

**Quand l'utiliser**:
- Après un `git pull` qui modifie `schema.prisma`
- Quand vous ne pouvez pas créer d'articles de blog
- Après une migration de base de données
- En cas d'erreur "Table blog_posts doesn't exist"

---

### 2. **test-blog.ts** - Diagnostic Complet du Système de Blog

Script de diagnostic qui teste toutes les opérations CRUD sur les articles de blog.

**Usage**:
```bash
npm run test:blog
```

**Ce que fait le script**:
1. Teste la connexion à la base de données
2. Vérifie l'existence de la table `blog_posts`
3. Liste tous les articles existants
4. Crée un article de test
5. Lit l'article créé
6. Met à jour l'article (publie)
7. Supprime l'article de test

**Quand l'utiliser**:
- Pour diagnostiquer un problème de blog
- Avant un déploiement en production
- Pour vérifier la santé de la base de données
- Lors du debugging

---

## 🚀 Workflow Recommandé

### Problème: "Je ne peux pas créer d'articles de blog"

```bash
# 1. Exécuter le diagnostic
npm run test:blog

# 2. Si le diagnostic échoue, réparer la base
bash scripts/fix-blog-database.sh

# 3. Redémarrer l'application
# En développement:
npm run dev

# En production (Docker):
docker compose restart
```

---

## 📚 Documentation Complète

Pour un guide de dépannage détaillé, consultez:
- **[TROUBLESHOOTING_BLOG.md](../TROUBLESHOOTING_BLOG.md)** - Guide complet de résolution de problèmes

---

## 🛠️ Créer un Nouveau Script

### Template de Script Shell

```bash
#!/bin/bash

##############################################################################
# Nom du Script
#
# Description de ce que fait le script
#
# Usage:
#   ./scripts/mon-script.sh [options]
##############################################################################

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Nom du Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Votre code ici
```

### Template de Script TypeScript

```typescript
#!/usr/bin/env tsx

/**
 * Nom du Script
 *
 * Description de ce que fait le script
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("🔧 Nom du Script")

    // Votre code ici

  } catch (error) {
    console.error("❌ Erreur:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

### Ajouter au package.json

```json
{
  "scripts": {
    "mon-script": "ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/mon-script.ts"
  }
}
```

---

## ⚠️ Bonnes Pratiques

1. **Toujours tester en local** avant d'exécuter en production
2. **Faire un backup** de la base de données avant les scripts destructifs
3. **Logger les actions** pour faciliter le debugging
4. **Gérer les erreurs** avec `try/catch` et codes de sortie appropriés
5. **Documenter** chaque script avec commentaires et README

---

## 🔒 Sécurité

- Ne jamais committer de secrets (mots de passe, clés API) dans les scripts
- Utiliser les variables d'environnement (`.env`)
- Ne pas exécuter de scripts non vérifiés provenant de sources externes
- Toujours vérifier les permissions avant exécution (`chmod +x`)

---

## 📞 Support

En cas de problème avec un script:

1. Vérifier les logs d'erreur
2. Consulter la documentation associée
3. Vérifier que les dépendances sont installées (`npm install`)
4. Vérifier que les variables d'environnement sont définies (`.env`)

---

**Dernière mise à jour**: 12/11/2025
