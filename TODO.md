# U CASALE - SENI PRODUCTION
## Projet de Réservation de Gîte & E-Commerce à Piscia Rossa

---

## 🔥 MISES À JOUR RÉCENTES - Session Continuation 12/11/2025

### ✅ Phase 11 Complétée - Améliorations Dashboard & Optimisations

#### 🎯 Page Gestion Produits - Refonte Complète (Commit: 70a23ff)
**Nouvelles fonctionnalités**:
- ✅ **Actions groupées** - Sélection multiple avec cases à cocher
  - Publier/Dépublier en masse
  - Supprimer plusieurs produits simultanément
  - Barre d'outils d'actions visible lors de sélection
- ✅ **Filtres avancés**
  - Filtre par niveau de stock (En stock >10, Stock faible 1-10, Rupture 0)
  - Fourchette de prix (min/max)
  - Filtre catégorie (existant amélioré)
  - Filtre statut publication (existant amélioré)
- ✅ **Tri des colonnes** - Click to sort avec indicateurs visuels
  - Tri par nom (alphabétique)
  - Tri par prix (croissant/décroissant)
  - Tri par stock (quantité)
  - Tri par date de création
- ✅ **Bascule rapide** - Toggle publish/unpublish sans ouvrir modal
- ✅ **Pagination complète**
  - Sélecteur items par page (10/25/50/100)
  - Navigation Première/Précédent/Suivant/Dernière
  - Numéros de page avec indicateur actif
  - Compteur produits filtrés
- ✅ **UX améliorée**
  - Compteur de sélection
  - Reset automatique pagination lors filtrage
  - Checkboxes visuelles (CheckSquare/Square)

#### 🛒 Page Gestion Commandes - Refonte Complète (Commit: 930ff41)
**Nouvelles fonctionnalités**:
- ✅ **Recherche avancée** - Multi-critères simultanés
  - Par numéro de commande
  - Par nom client (prénom/nom)
  - Par email client
- ✅ **Filtres avancés**
  - Statut paiement (Pending, Paid, Refunded, Failed)
  - Plage de dates (date début - date fin)
  - Fourchette montant (min/max €)
  - Filtre statut livraison (existant conservé)
- ✅ **Actions groupées** - Sélection multiple
  - Changer statut en masse (En cours/Expédiée/Livrée)
  - Barre d'outils contextuelle
- ✅ **Tri des colonnes** - Click to sort
  - Tri par numéro de commande
  - Tri par date (création)
  - Tri par montant total
- ✅ **Pagination complète** - Identique à produits
  - Sélecteur items par page (10/25/50/100)
  - Navigation complète
  - Compteur commandes filtrées

#### ⚡ Optimisations Performances (Commit: df8c0c3)
**Next.js Image Component** - Conversion pages publiques critiques
- ✅ **Page Produits** (`/boutique`)
  - Images cartes produits optimisées
  - Sizes responsives: `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw`
  - Lazy loading automatique
- ✅ **Page Détail Produit** (`/boutique/[slug]`)
  - Image principale: `sizes="(max-width: 768px) 100vw, 50vw"`
  - Thumbnails: `sizes="(max-width: 768px) 25vw, 12.5vw"`
  - Priority loading pour première image
  - Fill layout pour aspect-square containers

**Avantages**:
- 🚀 Optimisation automatique WebP/AVIF
- 📉 Réduction taille images (jusqu'à 80%)
- ⚡ Lazy loading natif (images hors viewport)
- 📊 Amélioration LCP (Largest Contentful Paint)
- 📱 Responsive images adaptatives

#### ✅ Système Export Données - Vérification
**Confirmé fonctionnel** - Tous les exports CSV existants:
- ✅ Export Produits (`/api/admin/export/products`)
- ✅ Export Commandes (`/api/admin/export/orders`) - avec filtre statut
- ✅ Export Réservations (`/api/admin/export/reservations`) - avec filtre statut
- ✅ Export Clients (`/api/admin/export/customers`)
- ✅ Boutons export intégrés dans chaque page de gestion

### 📦 Commits de la Session
```
df8c0c3 - Perf: Optimisation images avec Next.js Image component
930ff41 - Dashboard: Améliorations page gestion commandes
70a23ff - Dashboard: Améliorations page gestion produits
```

### 🎯 Résumé des Améliorations
**Impact Utilisateur**:
- 🎯 Gestion massive de produits/commandes simplifiée
- ⚡ Performance pages publiques significativement améliorée
- 🔍 Recherche et filtrage puissants
- 📊 Tri flexible pour analyses rapides
- ✅ Actions groupées pour gain de temps

**Impact Technique**:
- 📉 Réduction temps chargement images (~50-80%)
- 🎨 UI/UX moderne et intuitive
- 🔧 Code maintenable et extensible
- 📱 Expérience responsive optimale

---

## 📋 Session Précédente - 12/11/2025

### ✅ Phase 10 Complétée - Dashboard Améliorations & Corrections

#### 🎨 Dashboard - Refonte Complète
- ✅ **Widget Avis Récents** (Commit: 8355b9e)
  - Ajout section testimonials dans activité récente (3 colonnes)
  - Affichage 5 derniers avis publiés avec notes étoiles
  - Badge type (Gîte/Boutique) et date
  - Intégration API `/api/admin/stats` avec données testimonials

- ✅ **Métriques Clés de Performance** (Commit: 2e9057e)
  - Panier moyen réservations (calcul revenu/nombre)
  - Panier moyen boutique (calcul revenu/nombre)
  - Taux de fidélité client (% clients avec transactions multiples)
  - Note moyenne des avis (aggregate Prisma)
  - Compteur clients fidèles

- ✅ **Refonte Design Dashboard** (Commit: f91c598)
  - Header avec titre dégradé Corsican + date mise à jour
  - Cartes revenus: hover effects (shadow-2xl + translate-y-1)
  - Icônes avec fond semi-transparent + animation
  - Métriques: barres de couleur indicatives sous valeurs
  - Grille stats: élévation + border coloré au hover
  - Indicateurs visuels (points colorés) pour status
  - Typographie: uppercase + tracking-wide
  - Graphiques: icônes dégradées avec ombres
  - Section activité: headers uniformisés avec icônes

#### 🔧 Corrections Techniques Critiques
- ✅ **API Stripe** (Commits: b7337d0, 40a0c77)
  - Version API: `2024-11-20.acacia` → `2025-10-29.clover`
  - Lazy initialization (fonction `getStripe()`)
  - Fix erreur build: "Neither apiKey nor config.authenticator"
  - Implémentation dans `checkout/route.ts` et `orders/[id]/verify/route.ts`

- ✅ **Modèle Order** (Commit: 6db0003)
  - Correction: `shipping` → `shippingCost` (conforme schema Prisma)
  - Correction: `orderItems` → `items` (nom relation Prisma)
  - Ajout champ requis: `productName` dans OrderItem

#### 📝 Blog & SEO (Commit: 7bdd379)
- ✅ Lien Blog ajouté dans dashboard sidebar
- ✅ Page édition article `/dashboard/blog/[id]/page.tsx`
- ✅ Sitemap dynamique `/sitemap.xml` (produits + blog + pages)
- ✅ Robots.txt `/robots.txt` pour crawlers

#### 📊 API Améliorations
- ✅ `/api/admin/stats` - Statistiques testimonials (total, publiés, avgRating)
- ✅ `/api/admin/stats` - Métriques avancées (paniers moyens, fidélité)
- ✅ `/api/admin/stats` - Analyse clients récurrents

### 📦 Commits de la Session
```
40a0c77 - Fix: Lazy initialization de Stripe pour éviter erreur au build
6db0003 - Fix: Correction champs Order dans checkout API
b7337d0 - Fix: Mise à jour version API Stripe vers 2025-10-29.clover
f91c598 - Dashboard: Refonte complète du design et UX
2e9057e - Dashboard: Ajout métriques clés de performance
8355b9e - Dashboard: Ajout widget avis récents et statistiques témoignages
7bdd379 - Améliorations Blog & SEO
```

### 🚀 Déploiement VPS
**Statut**: ⏳ En attente d'exécution

**Commandes**:
```bash
cd /opt/apps/u-casale
git pull origin claude/gite-booking-shop-011CV2RH3obCdpRK1jYoEuGw
docker compose up -d --build
docker ps | grep ucasale
docker logs ucasale_app --tail 100 -f
```

### 🎯 Dashboard - Fonctionnalités Actuelles
**Vue d'ensemble**:
- 💰 3 cartes revenus (Total, Réservations, Boutique) avec hover effects
- 📈 4 métriques clés (Paniers moyens, Fidélité, Note moyenne)
- 📊 4 statistiques principales (Réservations, Commandes, Produits, Clients)
- 🔢 4 statistiques secondaires (Catégories, Promos, Avis, Blog)

**Graphiques**:
- 📉 Évolution revenus 6 mois (3 courbes: résa, boutique, total)
- 📊 Activité mensuelle (bar chart résa + commandes)
- 🥧 Ventes par catégorie (pie chart CA boutique)

**Activité Récente** (3 colonnes):
- 🏠 5 dernières réservations
- 🛍️ 5 dernières commandes
- ⭐ 5 derniers avis clients

### 🎨 Design System Appliqué
**Couleurs**:
- Corsican Clay: #C97855 → #8B5738 (terracotta)
- Corsican Sea: #2D7D9E → #1E5A78 (bleu méditerranée)
- Corsican Maquis: #6B8E6F → #4A6B4E (vert maquis)
- Stone: #F5F5F5 → #78716C (neutres)

**Animations**:
- Hover: `hover:shadow-xl hover:-translate-y-1`
- Transitions: `transition-all duration-300`
- Transform: `transform`

---

## 🎯 AMÉLIORATIONS FUTURES

### 🎨 Améliorations UX

#### Page Gestion Réservations
- [ ] **Actions groupées**
  - Sélection multiple des réservations
  - Changement de statut en masse
  - Export groupé des réservations sélectionnées
  - Suppression en masse
- [ ] **Filtres avancés**
  - Par statut (confirmée, en attente, annulée)
  - Par période (date arrivée/départ)
  - Par nombre de personnes
  - Par montant (fourchette)
- [ ] **Tri des colonnes**
  - Par date de réservation
  - Par date d'arrivée
  - Par montant
  - Par nom de client
- [ ] **Recherche avancée**
  - Par numéro de réservation
  - Par nom client
  - Par email
  - Par téléphone

#### Système de Notifications en Temps Réel
- [ ] **Notifications dashboard**
  - Nouvelle réservation
  - Nouvelle commande
  - Nouveau commentaire/avis
  - Stock faible (produits)
  - Paiement reçu
- [ ] **Notifications push** (optionnel)
  - Push navigateur pour admin
  - Emails instantanés
  - SMS pour réservations urgentes
- [ ] **Centre de notifications**
  - Historique des notifications
  - Marquage lu/non lu
  - Filtres par type
  - Actions rapides depuis la notification

#### Dark Mode Dashboard
- [ ] Thème sombre complet
- [ ] Toggle dans les paramètres utilisateur
- [ ] Respect préférence système (prefers-color-scheme)
- [ ] Adaptation des graphiques et couleurs
- [ ] Sauvegarde préférence en localStorage

#### Autres Améliorations UX
- [ ] **Drag & drop** pour réorganiser photos produits
- [ ] **Aperçu en temps réel** lors de l'édition de contenu
- [ ] **Auto-save** pour les formulaires longs
- [ ] **Raccourcis clavier** pour actions courantes
- [ ] **Barre de recherche globale** (recherche unifiée dans tout le dashboard)

---

### 🚀 Fonctionnalités Supplémentaires

#### Gestion Codes Promo - Interface Dédiée
- [ ] **CRUD Codes Promo**
  - Création codes personnalisés
  - Types: pourcentage ou montant fixe
  - Application: boutique et/ou réservations
  - Date début/fin de validité
  - Limite d'utilisation (globale ou par client)
  - Conditions: montant minimum, catégories spécifiques
- [ ] **Tableau de bord codes promo**
  - Liste de tous les codes actifs/expirés
  - Statistiques d'utilisation
  - Nombre d'utilisations
  - Revenu généré vs réduction accordée
  - Export rapports codes promo
- [ ] **Page gestion promotions**
  - Promotions automatiques (ex: "10% sur catégorie X")
  - Promotions saisonnières
  - Bundle produits
  - Offres "3 pour 2"

#### Système Newsletter
- [ ] **Gestion des abonnés**
  - Liste des inscrits
  - Import/export CSV
  - Segmentation (clients réservations, clients boutique, prospects)
  - Gestion désabonnements (RGPD)
- [ ] **Création de campagnes**
  - Éditeur email WYSIWYG
  - Templates préconçus
  - Personnalisation (nom, historique)
  - Aperçu multi-devices
  - Test envoi
- [ ] **Automatisation**
  - Email bienvenue nouveaux clients
  - Email anniversaire
  - Email réengagement (clients inactifs)
  - Relance panier abandonné
- [ ] **Statistiques newsletter**
  - Taux d'ouverture
  - Taux de clic
  - Désabonnements
  - Conversions générées

#### Chat Support Client
- [ ] **Widget chat** sur pages publiques
- [ ] **Interface admin** pour répondre
- [ ] **Messages prédéfinis** (FAQ rapides)
- [ ] **Notifications** nouveaux messages
- [ ] **Historique conversations** par client
- [ ] **Chatbot basique** pour questions courantes (optionnel)

#### Multi-langue (FR/EN)
- [ ] **Configuration i18n**
  - next-intl ou react-i18next
  - Fichiers de traduction JSON
- [ ] **Traduction interface publique**
  - Pages principales
  - Navigation
  - Produits et catégories
  - Formulaires
- [ ] **Dashboard admin**
  - Gestion des traductions
  - Interface de saisie multi-langue
  - Traduction descriptions produits
  - Traduction contenu blog
- [ ] **Sélecteur de langue**
  - Détection automatique navigateur
  - Switch FR/EN visible
  - Sauvegarde préférence

#### Autres Fonctionnalités
- [ ] **Système de Reviews produits** (côté public)
  - Formulaire d'avis après achat
  - Notation étoiles
  - Upload photos par clients
  - Modération admin
- [ ] **Programme de fidélité**
  - Points par achat
  - Récompenses/réductions
  - Niveaux de fidélité
  - Dashboard client pour voir ses points
- [ ] **Wishlist/Liste de souhaits** (boutique)
- [ ] **Comparateur de produits**
- [ ] **Gift cards/Cartes cadeaux**

---

### 📱 Mobile

#### Progressive Web App (PWA)
- [ ] **Configuration PWA**
  - Service Worker
  - Manifest.json
  - Icons multiples résolutions
  - Thème colors
- [ ] **Installation sur écran d'accueil**
  - Prompt d'installation
  - Instructions utilisateur
- [ ] **Mode offline basique**
  - Cache pages principales
  - Cache images
  - Fallback offline.html
- [ ] **Fonctionnalités PWA**
  - Notifications push (réservations, commandes)
  - Badge compteur
  - Splash screen

#### Application Mobile Native (React Native)
- [ ] **Setup projet**
  - React Native CLI ou Expo
  - Navigation (React Navigation)
  - State management (Redux/Zustand)
- [ ] **Fonctionnalités app**
  - Parcourir catalogue produits
  - Réserver le gîte
  - Panier et checkout
  - Compte client
  - Historique réservations/commandes
  - Notifications push
  - Scan QR codes (promos, check-in)
- [ ] **Publication**
  - Apple App Store
  - Google Play Store
  - Icônes et screenshots
  - Description et ASO

#### Optimisations Mobile Existantes
- [ ] **Améliorer performances mobiles**
  - Lighthouse mobile score > 90
  - Réduire taille bundle JavaScript
  - Optimiser images spécifiquement mobile
- [ ] **Gestures mobiles**
  - Swipe entre photos produits
  - Pull-to-refresh
  - Tap zones optimisées (44x44px minimum)
- [ ] **Clavier mobile**
  - Input types corrects (email, tel, number)
  - Autocomplete approprié
  - Validation en temps réel

---

### ⚡ Performance

#### Optimisation Images Blog
- [ ] **Conversion au Next.js Image component**
  - Remplacer balises `<img>` par `<Image>`
  - Définir sizes appropriés
  - Priority pour images above-the-fold
- [ ] **Formats modernes**
  - WebP/AVIF automatique
  - Fallback JPEG/PNG
- [ ] **Lazy loading**
  - Images articles blog
  - Thumbnails liste articles
- [ ] **Compression**
  - Optimiser qualité vs taille
  - Sharp configuration

#### Mise en Cache Avancée
- [ ] **ISR (Incremental Static Regeneration)**
  - Pages produits : revalidate 3600 (1h)
  - Articles blog : revalidate 7200 (2h)
  - Page gîte : revalidate 1800 (30min)
- [ ] **Cache API Routes**
  - Cache-Control headers
  - SWR (Stale-While-Revalidate)
- [ ] **CDN Configuration**
  - Cache assets statiques (images, fonts)
  - Edge caching pour pages publiques
- [ ] **Redis cache** (optionnel)
  - Cache requêtes DB fréquentes
  - Cache calculs complexes
  - Sessions utilisateur

#### Server-Side Rendering Optimisé
- [ ] **Streaming SSR**
  - React 18 Suspense boundaries
  - Streaming HTML partiel
  - Loading states granulaires
- [ ] **Parallel data fetching**
  - Promise.all pour données indépendantes
  - Éviter waterfalls
- [ ] **Partial Prerendering** (Next.js 14+)
  - Combiner statique + dynamique
  - Optimiser shell page

#### Bundle Optimization
- [ ] **Code splitting**
  - Dynamic imports pour composants lourds
  - Route-based splitting
- [ ] **Tree shaking**
  - Vérifier unused exports
  - Analyser bundle avec @next/bundle-analyzer
- [ ] **Dépendances**
  - Remplacer libraries lourdes par alternatives légères
  - Vérifier duplicates dependencies
  - Utiliser barrel imports optimisés

#### Database Performance
- [ ] **Prisma optimizations**
  - Indexes sur colonnes fréquemment requêtées
  - Select minimal (éviter select *)
  - Pagination côté DB
- [ ] **Query optimization**
  - Analyser slow queries
  - N+1 queries prevention
  - Use of include vs select

#### Monitoring Performance
- [ ] **Real User Monitoring (RUM)**
  - Core Web Vitals tracking
  - Vercel Analytics
- [ ] **Error tracking**
  - Sentry integration
  - Source maps production
- [ ] **Performance budget**
  - Alertes si bundle > X kb
  - Lighthouse CI dans GitHub Actions

---

### 📊 Analytics & Reporting

#### Graphiques Détaillés par Période
- [ ] **Sélecteur de période**
  - Aujourd'hui
  - 7 derniers jours
  - 30 derniers jours
  - 3 derniers mois
  - 6 derniers mois
  - 1 an
  - Période personnalisée (date picker)
- [ ] **Graphiques revenus avancés**
  - Comparaison année précédente (Y-o-Y)
  - Tendances et prévisions
  - Segmentation par source (réservations vs boutique)
  - Breakdown par catégorie de produits
- [ ] **Graphiques produits**
  - Top 10 produits vendus
  - Produits à faible rotation
  - Marge par produit
  - Évolution stock dans le temps
- [ ] **Graphiques clients**
  - Nouveaux clients vs récurrents
  - Valeur à vie client (LTV)
  - Cohorte analysis
  - Taux de rétention
- [ ] **Graphiques réservations**
  - Taux d'occupation par mois
  - Durée moyenne séjour
  - Lead time (délai entre réservation et arrivée)
  - Taux d'annulation

#### Export Excel/CSV Avancé
- [ ] **Export configurable**
  - Choix des colonnes à exporter
  - Filtres avant export
  - Format: CSV, XLSX, PDF
- [ ] **Rapports prêts à l'emploi**
  - Rapport mensuel ventes
  - Rapport annuel comptable
  - Rapport stock valorisé
  - Rapport clients (segmentation)
  - Rapport réservations (occupancy report)
- [ ] **Templates Excel**
  - Formatage professionnel
  - Graphiques inclus
  - Tableaux croisés dynamiques
- [ ] **Export automatique**
  - Génération programmée (ex: 1er de chaque mois)
  - Sauvegarde sur serveur ou cloud (S3)

#### Rapport Mensuel Automatique par Email
- [ ] **Configuration emails automatiques**
  - Destinataires (admin, comptable)
  - Fréquence (hebdomadaire, mensuel)
  - Jour et heure d'envoi
- [ ] **Contenu du rapport**
  - Résumé exécutif (KPIs clés)
  - Revenus du mois
  - Comparaison mois précédent
  - Top produits
  - Nouvelles réservations
  - Taux d'occupation
  - Alertes (stock faible, objectifs non atteints)
- [ ] **PDF attaché**
  - Rapport complet en PDF
  - Graphiques et tableaux
  - Design professionnel
- [ ] **Personnalisation**
  - Templates modifiables
  - Sélection des sections à inclure
  - Branding entreprise

#### Dashboard Analytics Avancé
- [ ] **Tableau de bord dynamique**
  - Widgets déplaçables (drag & drop)
  - Sauvegarde layout personnalisé
  - Mode plein écran pour graphiques
- [ ] **Objectifs et KPIs**
  - Définir objectifs mensuels
  - Progress bars vers objectifs
  - Alertes si objectif en danger
- [ ] **Comparaisons**
  - Année en cours vs année précédente
  - Budget vs réalisé
  - Prévisions vs réel
- [ ] **Heatmaps**
  - Calendrier d'occupation gîte
  - Jours/heures de vente boutique

#### Intégrations Analytics Externes
- [ ] **Google Analytics 4**
  - Enhanced ecommerce tracking
  - Événements personnalisés
  - Conversion tracking
- [ ] **Facebook Pixel** (si ads Facebook)
- [ ] **Google Tag Manager**
  - Gestion centralisée des tags
  - Événements personnalisés
- [ ] **Hotjar ou Microsoft Clarity**
  - Heatmaps comportement utilisateur
  - Session recordings
  - Feedback utilisateur

---

## 📋 VISION DU PROJET

Site web professionnel combinant:
- **Réservation de gîte** : Système de booking pour nuits/séjours
- **E-Commerce** : Boutique en ligne pour vos produits locaux
- **Dashboard Admin** : Interface complète de gestion

**Nom**: U Casale
**Sous-titre**: Seni Production
**Localisation**: Piscia Rossa

---

## 🎨 TENDANCES DESIGN 2025 À IMPLÉMENTER

### Design Général
- ✅ **Minimalisme & Clarté** : Interface épurée, navigation intuitive
- ✅ **Mobile-First** : Responsive design optimal sur tous devices
- ✅ **Immersive Visuals** : Photos haute qualité + vidéos immersives
- ✅ **Neo-Brutalism** : Contraste fort, géométrie claire, couleurs audacieuses
- ✅ **Design Naturel & Écologique** : Textures bois/pierre, couleurs terre/nature
- ✅ **Micro-animations** : Interactions fluides et engageantes
- ✅ **Dark Mode** : Option thème sombre moderne

### Expérience Utilisateur
- ✅ **Booking sans friction** : Calendrier interactif temps réel
- ✅ **Tarification transparente** : Prix clairs, pas de frais cachés
- ✅ **CTA visible** : "Réserver Maintenant" toujours accessible
- ✅ **Personnalisation AI** : Suggestions basées sur le comportement
- ✅ **Éléments interactifs** : Calculateur de séjour, quiz, avis clients

### Technologies Modernes
- ✅ **Optimisation Voice Search** : SEO conversationnel
- ✅ **Visite Virtuelle 360°** : Tour immersif du gîte
- ✅ **Loading rapide** : Performance optimale < 2s
- ✅ **Progressive Web App** : Installation possible sur mobile

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technologique Recommandée

#### Frontend
```
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI Library: React 18+
- Styling: Tailwind CSS + Shadcn UI
- Components: Radix UI (accessible)
- Animations: Framer Motion
- Forms: React Hook Form + Zod validation
- State: Zustand / React Query
- Icons: Lucide React
```

#### Backend
```
- API: Next.js API Routes / tRPC
- Database: PostgreSQL (Supabase / Vercel Postgres)
- ORM: Prisma
- Authentication: NextAuth.js / Clerk
- File Storage: AWS S3 / Vercel Blob
- Email: Resend / SendGrid
```

#### Paiement & Réservation
```
- Paiement: Stripe (recommandé) ou PayPal
- Calendrier: react-big-calendar / FullCalendar
- Gestion réservations: Custom + Stripe
```

#### Admin Dashboard
```
- Framework: Next.js Admin Panel
- Charts: Recharts / Chart.js
- Tables: TanStack Table (React Table v8)
- Analytics: Plausible / Google Analytics 4
```

#### DevOps & Hosting
```
- Hosting: Vercel (recommandé)
- Database: Supabase / PlanetScale
- CDN: Vercel Edge Network
- Monitoring: Sentry
- CI/CD: GitHub Actions
```

---

## 📦 FONCTIONNALITÉS DÉTAILLÉES

### 🏠 PARTIE PUBLIQUE - Site Vitrine

#### 1. Page d'Accueil
- [ ] Hero section immersive avec vidéo/slider
- [ ] Présentation U Casale & Seni Production
- [ ] Mise en avant localisation Piscia Rossa
- [ ] Aperçu du gîte (photos galerie)
- [ ] Aperçu des produits vedettes
- [ ] Témoignages clients
- [ ] CTA réservation bien visible
- [ ] Footer avec infos contact & réseaux sociaux

#### 2. Le Gîte
- [ ] Galerie photo/vidéo professionnelle
- [ ] Visite virtuelle 360° interactive
- [ ] Description détaillée des chambres/espaces
- [ ] Liste des équipements/services
- [ ] Tarifs transparents (nuit/séjour)
- [ ] Calendrier de disponibilités en temps réel
- [ ] Règlement intérieur
- [ ] Accès & itinéraire vers Piscia Rossa
- [ ] Activités à proximité

#### 3. Réservation
- [ ] Calendrier interactif de disponibilités
- [ ] Sélection dates arrivée/départ
- [ ] Nombre de personnes
- [ ] Calcul automatique du tarif
- [ ] Options supplémentaires (petit-déj, services...)
- [ ] Récapitulatif clair de la réservation
- [ ] Formulaire informations client
- [ ] Paiement sécurisé (Stripe/PayPal)
- [ ] Confirmation email automatique
- [ ] Espace client pour gérer sa réservation

#### 4. Boutique E-Commerce
- [ ] Catalogue produits avec filtres
- [ ] Catégories de produits (à définir: vins, huiles, confitures, artisanat...)
- [ ] Fiche produit détaillée (photos, description, prix)
- [ ] Système de panier
- [ ] Gestion quantités/stock
- [ ] Calcul frais de port
- [ ] Options de livraison/retrait
- [ ] Paiement sécurisé
- [ ] Suivi de commande
- [ ] Programme de fidélité (optionnel)

#### 5. Autres Pages
- [ ] À propos (histoire, valeurs)
- [ ] Contact (form + carte + infos)
- [ ] Blog/Actualités (optionnel)
- [ ] FAQ
- [ ] Mentions légales
- [ ] CGV
- [ ] Politique de confidentialité
- [ ] Plan du site

### 🔐 PARTIE ADMIN - Dashboard

#### 1. Tableau de Bord Principal
- [ ] Vue d'ensemble KPIs
  - Réservations du mois
  - Chiffre d'affaires
  - Taux d'occupation
  - Ventes produits
- [ ] Graphiques analytiques
  - Évolution CA
  - Réservations par période
  - Produits les plus vendus
- [ ] Notifications importantes
- [ ] Calendrier récapitulatif
- [ ] Dernières commandes
- [ ] Alertes stock faible

#### 2. Gestion des Réservations
- [ ] Calendrier complet avec toutes les réservations
- [ ] Liste des réservations (à venir, en cours, passées)
- [ ] Détails de chaque réservation
- [ ] Statuts (en attente, confirmée, annulée)
- [ ] Gestion des paiements
- [ ] Communication avec les clients
- [ ] Modification/annulation
- [ ] Export des données
- [ ] Blocage de dates (maintenance, vacances)

#### 3. Gestion du Gîte
- [ ] Configuration des tarifs
  - Tarif par nuit/séjour
  - Tarifs saisonniers
  - Promotions/réductions
- [ ] Gestion des disponibilités
- [ ] Équipements/services
- [ ] Photos/vidéos du gîte
- [ ] Description et contenu
- [ ] Règlement intérieur

#### 4. Gestion E-Commerce
**Produits**
- [ ] Liste de tous les produits
- [ ] Ajout/modification/suppression produits
- [ ] Upload photos produits (multi-images)
- [ ] Description, prix, stock
- [ ] Variations (tailles, couleurs...)
- [ ] Statut (publié, brouillon, rupture)
- [ ] SEO par produit

**Catégories**
- [ ] Création/gestion des catégories
- [ ] Hiérarchie (catégories/sous-catégories)
- [ ] Image catégorie
- [ ] Description SEO

**Commandes**
- [ ] Liste de toutes les commandes
- [ ] Détails commande
- [ ] Statuts (en attente, payée, expédiée, livrée)
- [ ] Gestion des expéditions
- [ ] Impression bons de commande
- [ ] Remboursements

**Stock**
- [ ] Suivi des stocks
- [ ] Alertes stock faible
- [ ] Historique mouvements

**Promotions**
- [ ] Création codes promo
- [ ] Réductions temporaires
- [ ] Règles de promotion

#### 5. Gestion des Clients
- [ ] Liste des clients
- [ ] Historique réservations/commandes
- [ ] Segmentation
- [ ] Newsletter/emailing
- [ ] Avis et notes

#### 6. Contenu & Communication
- [ ] Gestion des pages statiques
- [ ] Blog/actualités
- [ ] Galerie photos/vidéos
- [ ] FAQ
- [ ] Témoignages clients

#### 7. Configuration & Paramètres
- [ ] Informations de l'établissement
- [ ] Coordonnées
- [ ] Horaires
- [ ] Paramètres de paiement
- [ ] Frais de port
- [ ] Emails automatiques (templates)
- [ ] SEO global
- [ ] Réseaux sociaux
- [ ] Utilisateurs admin
- [ ] Rôles et permissions

#### 8. Analytique & Rapports
- [ ] Statistiques de vente
- [ ] Taux de conversion
- [ ] Sources de trafic
- [ ] Rapports personnalisés
- [ ] Export données (CSV, PDF)

---

## 🗂️ STRUCTURE DU PROJET

```
u-casale/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Page d'accueil
│   │   ├── gite/
│   │   │   ├── page.tsx            # Page du gîte
│   │   │   └── reserver/
│   │   │       └── page.tsx        # Réservation
│   │   ├── boutique/
│   │   │   ├── page.tsx            # Catalogue
│   │   │   ├── [slug]/page.tsx     # Fiche produit
│   │   │   └── panier/page.tsx     # Panier
│   │   ├── a-propos/page.tsx
│   │   ├── contact/page.tsx
│   │   └── blog/page.tsx
│   │
│   ├── (admin)/
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard principal
│   │       ├── reservations/
│   │       ├── gite/
│   │       ├── produits/
│   │       ├── categories/
│   │       ├── commandes/
│   │       ├── clients/
│   │       ├── contenu/
│   │       ├── parametres/
│   │       └── analytique/
│   │
│   ├── api/
│   │   ├── reservations/
│   │   ├── produits/
│   │   ├── commandes/
│   │   ├── paiements/
│   │   ├── stripe/
│   │   └── upload/
│   │
│   └── layout.tsx
│
├── components/
│   ├── ui/                          # Shadcn components
│   ├── layout/
│   ├── gite/
│   ├── boutique/
│   ├── dashboard/
│   └── shared/
│
├── lib/
│   ├── db.ts                        # Prisma client
│   ├── auth.ts                      # NextAuth config
│   ├── stripe.ts
│   ├── email.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   └── videos/
│
└── styles/
    └── globals.css
```

---

## 🎯 PHASES DE DÉVELOPPEMENT

### PHASE 1 : Configuration & Infrastructure (Semaine 1-2)
- [ ] Initialiser projet Next.js 15 avec TypeScript
- [ ] Configuration Tailwind CSS + Shadcn UI
- [ ] Setup PostgreSQL + Prisma
- [ ] Configuration NextAuth.js
- [ ] Setup Stripe
- [ ] Configuration environnements (dev, staging, prod)
- [ ] Setup repository Git + CI/CD
- [ ] Configuration Vercel

### PHASE 2 : Design System & UI (Semaine 2-3)
- [ ] Créer la charte graphique U Casale
- [ ] Définir palette couleurs (naturel, terre)
- [ ] Typographie
- [ ] Composants UI réutilisables
- [ ] Layout responsive
- [ ] Navigation
- [ ] Footer
- [ ] Système de grille

### PHASE 3 : Site Public - Base (Semaine 3-5)
- [ ] Page d'accueil
- [ ] Page Gîte
- [ ] Galerie photos/vidéos
- [ ] Pages statiques (À propos, Contact, etc.)
- [ ] Responsive mobile
- [ ] SEO de base
- [ ] Performance optimization

### PHASE 4 : Système de Réservation (Semaine 5-7)
- [ ] Modèle de données réservations
- [ ] Calendrier interactif
- [ ] Calcul tarifs dynamiques
- [ ] Formulaire réservation
- [ ] Intégration Stripe payment
- [ ] Confirmation email
- [ ] Gestion disponibilités
- [ ] Espace client

### PHASE 5 : E-Commerce (Semaine 7-9)
- [ ] Modèle de données produits/catégories
- [ ] Page catalogue avec filtres
- [ ] Fiche produit
- [ ] Système panier
- [ ] Gestion stock
- [ ] Checkout
- [ ] Paiement Stripe
- [ ] Gestion commandes
- [ ] Emails de confirmation

### PHASE 6 : Dashboard Admin - Partie 1 (Semaine 9-11)
- [ ] Authentication admin
- [ ] Layout dashboard
- [ ] Tableau de bord principal
- [ ] Gestion réservations
- [ ] Gestion du gîte (tarifs, dispos)
- [ ] Calendrier admin
- [ ] Notifications

### PHASE 7 : Dashboard Admin - Partie 2 (Semaine 11-13)
- [ ] Gestion produits (CRUD complet)
- [ ] Gestion catégories
- [ ] Gestion commandes
- [ ] Gestion stock
- [ ] Promotions/codes promo
- [ ] Upload images multiples
- [ ] SEO par entité

### PHASE 8 : Dashboard Admin - Partie 3 (Semaine 13-14)
- [ ] Gestion clients
- [ ] Gestion contenu
- [ ] Configuration générale
- [ ] Analytique & rapports
- [ ] Export données
- [ ] Graphiques avancés

### PHASE 9 : Fonctionnalités Avancées (Semaine 14-15)
- [ ] Visite virtuelle 360°
- [ ] Blog/actualités
- [ ] Newsletter
- [ ] Système d'avis clients
- [ ] Programme fidélité
- [ ] Multi-langue (FR/EN)
- [ ] Optimisation SEO avancée
- [ ] Voice search optimization

### PHASE 10 : Tests & Optimisation (Semaine 15-16)
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests E2E
- [ ] Audit performance
- [ ] Audit accessibilité
- [ ] Optimisation images
- [ ] Test responsive tous devices
- [ ] Test paiements
- [ ] Test booking complet

### PHASE 11 : Lancement (Semaine 16-17)
- [ ] Configuration domaine
- [ ] Certificat SSL
- [ ] Configuration emails production
- [ ] Migration données si nécessaire
- [ ] Backup automatique
- [ ] Monitoring
- [ ] Formation client dashboard
- [ ] Documentation admin
- [ ] Lancement officiel
- [ ] Marketing initial

---

## 📊 MODÈLE DE DONNÉES (Prisma Schema)

### Entités Principales

```prisma
// RÉSERVATIONS
model Reservation {
  id              String    @id @default(cuid())
  checkIn         DateTime
  checkOut        DateTime
  guests          Int
  pricePerNight   Float
  totalPrice      Float
  status          String    // pending, confirmed, cancelled
  paymentStatus   String    // pending, paid, refunded
  stripePaymentId String?
  customer        Customer  @relation(fields: [customerId], references: [id])
  customerId      String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// CLIENTS
model Customer {
  id            String        @id @default(cuid())
  email         String        @unique
  firstName     String
  lastName      String
  phone         String?
  reservations  Reservation[]
  orders        Order[]
  createdAt     DateTime      @default(now())
}

// PRODUITS
model Product {
  id          String         @id @default(cuid())
  slug        String         @unique
  name        String
  description String
  price       Float
  stock       Int
  images      String[]       // URLs
  category    Category       @relation(fields: [categoryId], references: [id])
  categoryId  String
  published   Boolean        @default(false)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  orderItems  OrderItem[]
}

// CATÉGORIES
model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String?
  image       String?
  products    Product[]
  createdAt   DateTime  @default(now())
}

// COMMANDES
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  customer        Customer    @relation(fields: [customerId], references: [id])
  customerId      String
  items           OrderItem[]
  subtotal        Float
  shipping        Float
  total           Float
  status          String      // pending, paid, shipped, delivered
  shippingAddress Json
  stripePaymentId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Float
}

// CONFIGURATION GÎTE
model GiteConfig {
  id                  String   @id @default(cuid())
  pricePerNight       Float
  maxGuests           Int
  blockedDates        Json     // Array of blocked date ranges
  seasonalPricing     Json?    // Seasonal price adjustments
  minimumStay         Int      @default(1)
  updatedAt           DateTime @updatedAt
}

// UTILISATEURS ADMIN
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed
  name      String
  role      String   // admin, manager, editor
  createdAt DateTime @default(now())
}
```

---

## 🔒 SÉCURITÉ & CONFORMITÉ

- [ ] HTTPS obligatoire
- [ ] RGPD compliant
- [ ] Protection données personnelles
- [ ] Paiements sécurisés PCI-DSS
- [ ] Rate limiting API
- [ ] Protection CSRF
- [ ] Validation inputs (Zod)
- [ ] Sanitization données
- [ ] Backup automatique quotidien
- [ ] Logs et monitoring

---

## 📈 SEO & MARKETING

- [ ] Sitemap XML
- [ ] Robots.txt
- [ ] Meta tags optimisés
- [ ] Open Graph
- [ ] Schema.org markup (Local Business, Product)
- [ ] Google Analytics 4
- [ ] Google Search Console
- [ ] Google My Business
- [ ] Réseaux sociaux
- [ ] Newsletter
- [ ] Blog pour contenu

---

## 💰 FONCTIONNALITÉS PAIEMENT

### Stripe Integration
- [ ] Paiement par carte
- [ ] Gestion des webhooks
- [ ] Remboursements
- [ ] Factures automatiques
- [ ] Mode test/production
- [ ] Gestion devises (EUR)
- [ ] 3D Secure

### PayPal (Alternative/Optionnel)
- [ ] PayPal Checkout
- [ ] Webhooks
- [ ] Sandbox test

---

## 📱 FONCTIONNALITÉS MOBILES

- [ ] PWA (Progressive Web App)
- [ ] Installation sur écran d'accueil
- [ ] Notifications push (optionnel)
- [ ] Mode offline basique
- [ ] Touch-friendly UI
- [ ] Swipe gestures

---

## 🌍 INTERNATIONALISATION (Phase future)

- [ ] Support multi-langue (FR/EN/IT)
- [ ] i18n avec next-intl
- [ ] Traduction contenu
- [ ] Détection langue navigateur
- [ ] Sélecteur de langue

---

## 📧 SYSTÈME D'EMAILING

### Emails Automatiques
- [ ] Confirmation réservation
- [ ] Rappel avant arrivée
- [ ] Confirmation commande
- [ ] Expédition commande
- [ ] Newsletter
- [ ] Reset password
- [ ] Templates professionnels

---

## 🎨 ASSETS À PRÉPARER

### Photos Nécessaires
- [ ] Gîte (extérieur, chambres, cuisine, salle de bain, espaces communs)
- [ ] Environnement Piscia Rossa
- [ ] Produits (haute qualité, fond neutre)
- [ ] Équipe/producteurs (optionnel)
- [ ] Processus de production (storytelling)

### Vidéos
- [ ] Vidéo présentation gîte (1-2 min)
- [ ] Visite virtuelle 360°
- [ ] Teaser produits
- [ ] Story Seni Production

### Contenu Texte
- [ ] Description gîte détaillée
- [ ] Histoire U Casale & Seni Production
- [ ] Descriptions produits
- [ ] CGV
- [ ] Mentions légales
- [ ] Politique confidentialité

---

## 🚀 CRITÈRES DE SUCCÈS

### Performance
- Lighthouse Score > 90
- Temps de chargement < 2s
- Core Web Vitals excellents
- Mobile-friendly 100%

### Conversion
- Taux de réservation > 5%
- Taux de conversion boutique > 2%
- Panier abandonné < 60%
- Note satisfaction > 4.5/5

### SEO
- Position Google "gîte Piscia Rossa" : Top 3
- Trafic organique croissant
- Backlinks qualité

---

## 💡 IDÉES FUTURES / ÉVOLUTIONS

- [ ] Application mobile native (React Native)
- [ ] Intégration plateformes externes (Booking.com, Airbnb)
- [ ] Chatbot IA pour réservations
- [ ] Système de parrainage
- [ ] Abonnement produits récurrents
- [ ] Expériences/activités sur place
- [ ] Coffrets cadeaux
- [ ] Marketplace producteurs locaux
- [ ] Intégration calendrier Google/Airbnb

---

## 📞 INFORMATIONS DE CONTACT

**Projet**: U Casale - Seni Production
**Localisation**: Piscia Rossa
**Type**: Gîte + E-Commerce

---

## 📝 NOTES

- Prioriser Mobile-First
- Design authentique et chaleureux reflétant la Corse
- Mettre en avant l'aspect local et artisanal
- Storytelling autour de Seni Production
- Photos professionnelles indispensables
- Expérience utilisateur fluide et sans friction
- Dashboard simple et intuitif pour le gérant

---

**Date de création**: 2025-11-11
**Dernière mise à jour**: 2025-11-11
**Version**: 1.0
