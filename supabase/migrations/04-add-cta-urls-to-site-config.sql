-- ============================================
-- Migration: Ajouter les URLs des CTA à site_config
-- Description: Permet de configurer dynamiquement les liens des boutons CTA du Hero
-- ============================================

-- Ajouter les colonnes pour les URLs des CTA
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS hero_cta_primary_url TEXT DEFAULT '/membres',
ADD COLUMN IF NOT EXISTS hero_cta_secondary_url TEXT DEFAULT '/actions';

-- Mettre à jour la configuration existante avec les valeurs par défaut
UPDATE site_config 
SET 
  hero_cta_primary_url = '/membres',
  hero_cta_secondary_url = '/actions'
WHERE hero_cta_primary_url IS NULL OR hero_cta_secondary_url IS NULL;

-- Commentaires sur les colonnes
COMMENT ON COLUMN site_config.hero_cta_primary_url IS 'URL du bouton CTA primaire du Hero (ex: /p/rejoindre-le-club)';
COMMENT ON COLUMN site_config.hero_cta_secondary_url IS 'URL du bouton CTA secondaire du Hero (ex: /actions)';
