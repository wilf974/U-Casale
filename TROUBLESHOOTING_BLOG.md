# Guide de Dépannage - Système de Blog

## Problème: Impossible de créer des articles de blog

Ce guide vous aidera à diagnostiquer et résoudre les problèmes de création d'articles dans le dashboard.

---

## 🔍 Diagnostic Rapide

### Étape 1: Vérifier la connexion à la base de données

```bash
# Sur le VPS ou en local
cd /opt/apps/u-casale  # ou votre chemin local

# Tester la connexion Prisma
npx prisma db push --skip-generate
```

**✅ Résultat attendu**: "The database is already in sync with the Prisma schema"

**❌ Si erreur**: Vérifier la variable `DATABASE_URL` dans `.env`

---

### Étape 2: Vérifier que le modèle BlogPost existe dans la base

```bash
# Exécuter le script de diagnostic
npm run test:blog
```

**✅ Résultat attendu**: Tous les tests passent avec succès

**❌ Si erreur "Table blog_posts n'existe pas"**:
```bash
# Synchroniser le schema avec la base
npx prisma db push
```

---

### Étape 3: Vérifier l'authentification

Le système de blog nécessite une authentification admin.

1. Ouvrir `/dashboard/blog` dans le navigateur
2. Vérifier que vous êtes bien connecté (présence du header avec nom d'utilisateur)
3. Ouvrir la console du navigateur (F12) et vérifier les erreurs

**❌ Si erreur 401 Unauthorized**:
- Vous n'êtes pas connecté → Aller à `/login`
- Votre session a expiré → Se reconnecter

---

### Étape 4: Tester la création via l'API directement

```bash
# Depuis le serveur où tourne l'application
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "slug": "test-article-'$(date +%s)'",
    "content": "Contenu de test",
    "published": false
  }'
```

**Analyser la réponse**:
- Code 401: Problème d'authentification
- Code 400: Validation échouée (vérifier les champs requis)
- Code 500: Erreur serveur (vérifier les logs)
- Code 200: Article créé avec succès ✅

---

## 🛠️ Solutions aux Problèmes Courants

### Problème 1: Erreur "Table blog_posts doesn't exist"

**Cause**: Le schema Prisma n'est pas synchronisé avec la base de données.

**Solution**:
```bash
# En développement
npx prisma db push

# En production (sur le VPS)
cd /opt/apps/u-casale
npx prisma db push
docker compose restart
```

---

### Problème 2: Erreur "Slug already exists"

**Cause**: Vous essayez de créer un article avec un slug déjà utilisé.

**Solution**:
1. Modifier le slug dans le formulaire
2. Ou supprimer l'article existant avec ce slug

---

### Problème 3: Client Prisma non généré

**Cause**: Le client Prisma n'a pas été généré après une modification du schema.

**Solution**:
```bash
npx prisma generate
```

Puis redémarrer le serveur Next.js:
```bash
# En développement
npm run dev

# En production (Docker)
docker compose restart
```

---

### Problème 4: Erreur 401 Unauthorized

**Cause**: Non authentifié ou session expirée.

**Solution**:
1. Se connecter via `/login`
2. Vérifier que l'utilisateur a le rôle ADMIN ou EDITOR
3. Vérifier la configuration NextAuth dans `lib/auth.ts`

---

### Problème 5: Rien ne se passe en cliquant sur "Publier" ou "Enregistrer"

**Cause**: Erreur JavaScript côté client.

**Solution**:
1. Ouvrir la console navigateur (F12)
2. Rechercher les erreurs en rouge
3. Vérifier les erreurs réseau dans l'onglet Network

**Erreurs possibles**:
- CORS error → Vérifier la configuration Next.js
- Network error → Vérifier que le serveur tourne
- Validation error → Vérifier les champs requis (titre, slug, contenu)

---

## 📋 Checklist de Vérification

Avant de créer un article, vérifier:

- [ ] Je suis connecté au dashboard
- [ ] La base de données est accessible
- [ ] Le modèle BlogPost existe dans la base (npm run test:blog)
- [ ] Le serveur Next.js est démarré
- [ ] Les champs requis sont remplis (titre, slug, contenu)
- [ ] Le slug est unique (pas déjà utilisé)

---

## 🔧 Commandes Utiles

### Diagnostic complet
```bash
npm run test:blog
```

### Vérifier les logs du serveur
```bash
# En développement
# Les logs s'affichent dans le terminal où npm run dev est exécuté

# En production (Docker)
docker logs ucasale_app --tail 100 -f
```

### Accéder à Prisma Studio (interface graphique DB)
```bash
npx prisma studio
```
Ouvrir http://localhost:5555 pour voir et modifier directement les données.

### Lister tous les articles de blog
```bash
npx prisma studio
# Ou via la console Prisma
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.blogPost.findMany().then(console.log).finally(() => prisma.\$disconnect());
"
```

---

## 🚀 Test Complet du Système

### 1. Via l'interface (Recommandé)

1. Se connecter au dashboard: http://localhost:3000/login
2. Aller sur: http://localhost:3000/dashboard/blog
3. Cliquer sur "Nouvel article"
4. Remplir le formulaire:
   - Titre: "Test Article Blog"
   - Slug: "test-article-blog" (généré automatiquement)
   - Contenu: "Ceci est un test"
5. Cliquer sur "Enregistrer brouillon"
6. Vérifier que l'article apparaît dans la liste

### 2. Via le script de diagnostic

```bash
npm run test:blog
```

### 3. Via l'API REST

```bash
# POST: Créer un article
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "title": "API Test Article",
    "slug": "api-test-article",
    "content": "Content via API",
    "excerpt": "Short description",
    "category": "actualites",
    "tags": ["test", "api"],
    "published": false
  }'

# GET: Lister tous les articles
curl http://localhost:3000/api/admin/blog \
  -H "Cookie: your-session-cookie"
```

---

## 📊 Structure du Modèle BlogPost

```prisma
model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique      // ⚠️ REQUIS + UNIQUE
  title       String                // ⚠️ REQUIS
  excerpt     String?               // Optionnel
  content     String                // ⚠️ REQUIS
  featuredImage String?             // Optionnel
  author      String   @default("U Casale")
  category    String?               // Optionnel
  tags        String[]              // Optionnel
  published   Boolean  @default(false)
  publishedAt DateTime?
  viewCount   Int      @default(0)
  metaTitle   String?               // SEO
  metaDescription String?           // SEO
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Champs requis pour création**:
- `title`
- `slug` (unique)
- `content`

---

## 🐛 Activer les Logs de Debug

### Prisma Debug Logs

```bash
# Ajouter à .env
DEBUG="prisma:*"

# Ou directement dans la commande
DEBUG="prisma:query" npm run dev
```

### Next.js Debug Logs

Ajouter dans `app/api/admin/blog/route.ts`:

```typescript
export async function POST(req: Request) {
  console.log("🔵 POST /api/admin/blog called")

  try {
    const session = await auth()
    console.log("🔵 Session:", session ? "Authenticated" : "Not authenticated")

    const body = await req.json()
    console.log("🔵 Request body:", JSON.stringify(body, null, 2))

    // ... rest of the code

    const post = await prisma.blogPost.create({ data: {...} })
    console.log("✅ Post created:", post.id)

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("❌ Error creating post:", error)
    // ...
  }
}
```

---

## 📞 Support

Si le problème persiste après avoir suivi ce guide:

1. Copier les logs d'erreur complets
2. Noter les étapes de reproduction exactes
3. Vérifier la console navigateur (F12 → Console)
4. Vérifier les logs serveur

**Logs à fournir**:
- Console navigateur (erreurs JavaScript)
- Logs serveur Next.js
- Résultat de `npm run test:blog`
- Version Node.js: `node --version`
- Version npm: `npm --version`

---

## ✅ Validation Finale

Une fois le problème résolu, vérifier:

1. ✅ Création d'article brouillon
2. ✅ Modification d'article
3. ✅ Publication d'article
4. ✅ Suppression d'article
5. ✅ Visibilité sur la page publique `/blog`
6. ✅ SEO (meta title/description)
7. ✅ Upload d'image featured
8. ✅ Filtres et recherche dans le dashboard

---

**Dernière mise à jour**: 12/11/2025
