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
- **Hosting** : Vercel

## 📦 Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local

# Configurer vos variables d'environnement dans .env.local

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

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

Consultez le fichier [TODO.md](./TODO.md) pour le plan détaillé de développement.

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
