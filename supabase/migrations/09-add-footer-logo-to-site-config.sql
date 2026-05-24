-- ============================================
-- Migration: Ajouter le logo du pied de page à site_config
-- Description: Permet de configurer dynamiquement le logo du pied de page du site
-- ============================================

-- Ajouter la colonne pour le logo du pied de page
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS footer_logo_url TEXT;

-- Commentaire sur la colonne
COMMENT ON COLUMN site_config.footer_logo_url IS 'URL de l''image du logo pour le pied de page (Footer)';
