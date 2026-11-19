-- ============================================
-- Migration: 24-clean-custom-pages-description.sql
-- Description: Nettoie la valeur '[object Object]' des colonnes description et meta_description
-- ============================================

UPDATE custom_pages
SET description = NULL
WHERE description = '[object Object]'
   OR description LIKE '%[object Object]%';

UPDATE custom_pages
SET meta_description = NULL
WHERE meta_description = '[object Object]'
   OR meta_description LIKE '%[object Object]%';
