# Base de Données - Prisma

Ce dossier contient le schéma Prisma et les migrations de la base de données.

## 📊 Modèles de Données

### Utilisateurs & Auth
- **User** : Utilisateurs admin (ADMIN, MANAGER, EDITOR)

### Gîte & Réservations
- **Customer** : Clients du gîte et de la boutique
- **Reservation** : Réservations de nuits au gîte
- **GiteConfig** : Configuration des tarifs et disponibilités du gîte

### E-Commerce
- **Product** : Produits de la boutique
- **Category** : Catégories de produits (avec hiérarchie)
- **Order** : Commandes clients
- **OrderItem** : Items de commande (lignes)
- **PromoCode** : Codes promo et réductions

### Configuration
- **SiteSettings** : Paramètres généraux du site

## 🚀 Commandes Utiles

### Développement Local

```bash
# Démarrer PostgreSQL avec Docker
docker compose -f docker-compose.dev.yml up -d

# Pousser le schéma vers la DB (développement rapide)
npm run db:push

# Ou créer une migration (recommandé pour production)
npm run db:migrate

# Générer le client Prisma
npm run db:generate

# Ouvrir Prisma Studio (interface visuelle)
npm run db:studio
```

### Production

Sur le VPS, les migrations se font automatiquement au déploiement via le Dockerfile.

Pour créer une nouvelle migration :

```bash
# 1. En local, créer la migration
npm run db:migrate

# 2. Commit les fichiers de migration
git add prisma/migrations
git commit -m "Add migration: description"

# 3. Push sur GitHub
git push

# 4. Sur le VPS, rebuild et redémarrer
cd /opt/apps/u-casale
git pull
docker compose build --no-cache app
docker compose up -d
```

## 🔄 Workflow de Modification du Schéma

1. **Modifier** `schema.prisma`
2. **Créer une migration** : `npm run db:migrate`
3. **Nommer la migration** explicitement (ex: "add_promo_codes")
4. **Tester** localement
5. **Commit** les changements
6. **Déployer** en production

## 📝 Seed Data (Optionnel)

Pour ajouter des données de test :

```bash
# Créer le fichier seed
touch prisma/seed.ts

# Exécuter le seed
npm run db:seed
```

## 🔗 Connexion Database

Les URLs de connexion sont définies dans `.env` :

**Développement Local** :
```
DATABASE_URL="postgresql://ucasale:devpassword@localhost:5432/ucasale_dev"
```

**Production (VPS)** :
```
DATABASE_URL="postgresql://ucasale:password@postgres:5432/ucasale_db"
```

## 📚 Documentation

- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
