-- Migration: Ajout des champs images dans home_page_content
-- Date: 2025-11-17

ALTER TABLE home_page_content
ADD COLUMN IF NOT EXISTS "giteImage" TEXT,
ADD COLUMN IF NOT EXISTS "boutiqueImage" TEXT;

-- Commentaires pour documentation
COMMENT ON COLUMN home_page_content."giteImage" IS 'URL de l''image de la section gîte (ex: /uploads/general/gite.jpg)';
COMMENT ON COLUMN home_page_content."boutiqueImage" IS 'URL de l''image de la section boutique (ex: /uploads/general/boutique.jpg)';
