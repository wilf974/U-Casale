-- Migration: Création de la table home_page_content pour contenu éditable de la page d'accueil
-- Date: 2025-11-17

CREATE TABLE IF NOT EXISTS home_page_content (
  id TEXT PRIMARY KEY,

  -- Section Hero
  "heroTitle" TEXT NOT NULL DEFAULT 'U Casale',
  "heroSubtitle" TEXT NOT NULL DEFAULT 'Seni Production',
  "heroDescription" TEXT NOT NULL DEFAULT 'Découvrez l''authenticité corse à Piscia Rossa. Gîte de charme et produits artisanaux locaux.',

  -- Section Gîte
  "giteTitle" TEXT NOT NULL DEFAULT 'Un havre de paix au cœur de la Corse',
  "giteDescription" TEXT NOT NULL DEFAULT 'Notre gîte authentique vous accueille à Piscia Rossa pour un séjour inoubliable. Profitez du calme de la nature corse dans un cadre chaleureux et convivial.',
  "giteFeatures" JSONB NOT NULL DEFAULT '["Capacité jusqu''à 6 personnes","Équipements modernes dans un cadre traditionnel","Vue panoramique sur le maquis"]',

  -- Section Boutique
  "boutiqueTitle" TEXT NOT NULL DEFAULT 'Produits artisanaux corses',
  "boutiqueDescription" TEXT NOT NULL DEFAULT 'Seni Production vous propose une sélection de produits locaux authentiques. Vins corses, huiles d''olive, confitures maison et bien plus encore.',
  "boutiqueFeatures" JSONB NOT NULL DEFAULT '["Production locale et artisanale","Livraison possible dans toute la France","Respect des traditions corses"]',

  -- Section Localisation
  "locationTitle" TEXT NOT NULL DEFAULT 'Piscia Rossa, Corse',
  "locationDescription" TEXT NOT NULL DEFAULT 'Situé dans un cadre naturel exceptionnel, U Casale vous accueille dans l''un des plus beaux endroits de l''île de beauté.',

  -- CTA Final
  "ctaTitle" TEXT NOT NULL DEFAULT 'Prêt pour votre séjour en Corse ?',
  "ctaDescription" TEXT NOT NULL DEFAULT 'Réservez dès maintenant votre gîte à Piscia Rossa et découvrez l''authenticité corse.',

  -- Timestamps
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Commentaires pour documentation
COMMENT ON TABLE home_page_content IS 'Contenu éditable de la page d''accueil du site';
COMMENT ON COLUMN home_page_content."heroTitle" IS 'Titre principal de la section hero';
COMMENT ON COLUMN home_page_content."heroSubtitle" IS 'Sous-titre de la section hero';
COMMENT ON COLUMN home_page_content."giteFeatures" IS 'Liste des caractéristiques du gîte (JSON array)';
COMMENT ON COLUMN home_page_content."boutiqueFeatures" IS 'Liste des caractéristiques de la boutique (JSON array)';
