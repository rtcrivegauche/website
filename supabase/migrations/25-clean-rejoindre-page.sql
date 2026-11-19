-- ============================================
-- Migration: 25-clean-rejoindre-page.sql
-- Description: Définit content_type à 'embed' et supprime le rich_content résiduel de test pour la page d'adhésion
-- ============================================

UPDATE custom_pages
SET content_type = 'embed',
    rich_content = NULL
WHERE slug LIKE '%rejoindre%';
