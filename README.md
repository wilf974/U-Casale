# U CASALE - Seni Production

Site web professionnel pour la réservation de gîte et la vente de produits artisanaux corses à Piscia Rossa.

## 🚀 Projet

Plateforme complète combinant :
- 🏠 **Réservation de gîte** : Système de booking avec calendrier en temps réel
- 🛒 **E-Commerce** : Boutique en ligne pour produits locaux
- 📊 **Dashboard Admin** : Interface de gestion complète

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS + Shadcn UI
- **Base de données** : PostgreSQL + Prisma
- **Paiement** : Stripe
- **Déploiement** : Docker + Docker Compose + Nginx + Let's Encrypt
- **Production** : VPS avec HTTPS (ucasale.woutils.com)

## 📦 Installation

### Développement Local

```bash
# Cloner le repository
git clone [url-du-repo]
cd u-casale

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local

# Configurer vos variables d'environnement dans .env.local

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Développement avec Docker (Base de données uniquement)

```bash
# Démarrer PostgreSQL + Adminer
docker compose -f docker-compose.dev.yml up -d

# Accéder à Adminer (interface DB)
# http://localhost:8080
# Server: postgres | User: ucasale | Password: devpassword | Database: ucasale_dev

# Dans un autre terminal
npm run dev
```

### 🚀 Déploiement en Production

Pour déployer sur votre VPS avec Docker, HTTPS et Let's Encrypt :

**[📖 Voir le Guide de Déploiement Complet](./DEPLOYMENT.md)**

Commandes rapides :

```bash
# Sur votre VPS
git clone [url-du-repo]
cd u-casale

# Configuration
cp .env.production.example .env
nano .env  # Configurer les variables

# Initialiser SSL (première fois uniquement)
./init-letsencrypt.sh

# Démarrer l'application
./deploy.sh start

# Ou avec Make
make start
```

**Site Production** : https://ucasale.woutils.com (ports 4080 HTTP / 4443 HTTPS)

## 📁 Structure du Projet

```
u-casale/
├── app/                    # Next.js App Router
│   ├── (public)/          # Routes publiques
│   ├── (admin)/           # Dashboard admin
│   ├── api/               # API routes
│   ├── globals.css        # Styles globaux
│   └── layout.tsx         # Layout principal
├── components/            # Composants React
│   ├── ui/               # Composants Shadcn UI
│   ├── layout/           # Composants de layout
│   ├── gite/             # Composants gîte
│   ├── boutique/         # Composants boutique
│   └── dashboard/        # Composants admin
├── lib/                  # Utilitaires
├── public/               # Assets statiques
└── prisma/              # Schema base de données
```

## 🎯 Fonctionnalités Principales

### Site Public
- ✅ Page d'accueil responsive
- 🔜 Système de réservation avec calendrier
- 🔜 Catalogue produits avec filtres
- 🔜 Panier et checkout
- 🔜 Paiement sécurisé Stripe

### Dashboard Admin
- 🔜 Gestion des réservations
- 🔜 Gestion du catalogue produits
- 🔜 Gestion des commandes
- 🔜 Analytique et rapports
- 🔜 Configuration du site

## 📝 Documentation

- **[TODO.md](./TODO.md)** - Plan détaillé de développement (17 phases)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide complet de déploiement Docker

## 🔧 Commandes Utiles

### Scripts de Déploiement

```bash
./deploy.sh start       # Démarrer les conteneurs
./deploy.sh stop        # Arrêter les conteneurs
./deploy.sh restart     # Redémarrer
./deploy.sh logs        # Voir les logs
./deploy.sh status      # Statut des conteneurs
./deploy.sh update      # Mise à jour (git pull + rebuild)
./deploy.sh backup      # Sauvegarder la base de données
./deploy.sh ssl-renew   # Renouveler le certificat SSL
```

### Makefile (Raccourcis)

```bash
make start          # Démarrer
make stop           # Arrêter
make logs           # Logs
make status         # Statut
make backup         # Backup
make help           # Voir toutes les commandes
```

### Docker Compose

```bash
docker compose up -d                # Démarrer en arrière-plan
docker compose down                 # Arrêter et supprimer
docker compose logs -f              # Logs en temps réel
docker compose ps                   # Statut des conteneurs
docker compose exec app sh          # Shell dans l'app
docker compose exec postgres psql -U ucasale ucasale_db  # PostgreSQL CLI
```

## 🔐 Sécurité

- HTTPS obligatoire
- RGPD compliant
- Paiements sécurisés PCI-DSS
- Protection CSRF et XSS

## 📈 SEO

- Meta tags optimisés
- Schema.org markup
- Sitemap.xml
- Performance optimale

## 🤝 Contribution

Pour toute question ou suggestion, contactez l'équipe de développement.

## 📄 Licence

Tous droits réservés - U Casale © 2025
