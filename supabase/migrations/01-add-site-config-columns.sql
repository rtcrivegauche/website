-- ============================================
-- MIGRATION 01 : Ajouter colonnes à site_config
-- ============================================
-- Description : Ajoute les colonnes pour gérer le contenu dynamique de la page d'accueil
-- À exécuter dans : Supabase SQL Editor
-- ============================================

-- Hero Section
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Servir Inspirer Grandir Ensemble';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Au Club Rotaract de Cotonou Rive Gauche Cica, nous formons une nouvelle génération de leaders engagés pour un impact durable au Bénin à travers le service et l''amitié.';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIULNbS7XfWej-OpF0Lhj0T6N2MwaCuyAbZBOxhKlgYzri86kTwHJCITDMg5OEs7JbGcl_TkLbmi1qvoVgkLQlvyBlnJA6SykVcR33zIHxuEDAoeYJJMcbHNquqxXoyq-cv3NZ0LeNu9S12ImN-E30CmRHG3u5fr7iXk7Nt2DSBw9zuh39eh_KIDqwD2XhfcRbshFs7I76W6rHr89QcNIIa0-dToUlkmupbTDI_zmF1UI7FQ7NRXufTWUd9XxaSQtJz4NARyH-5vs';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_cta_primary TEXT DEFAULT 'REJOINDRE LE CLUB';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_cta_secondary TEXT DEFAULT 'DÉCOUVRIR NOS ACTIONS';

-- About Section
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_image_url TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuC96fb1noioaBH_jJfnvyvIsRATmdaiqwUXuS7I8qarEGz4QmrlDaJAueRbzzgX1XSkA5YIki1N80mE5kS7FfRehofQarKjin6Kk3gh8sY4Xfk2oSAC_4cKj8eMRdapsCvWLGCTrWvAzg95hVc2esCXF-nAd9NsfhJN6UUXYDzAcMKoAtWRn0joe89Eh0yyVnt4EO_8vNwnihhTE9lel4789bljUXBhsQkIggOnysf4xVfvxXWWugNxdV2B38X81HpNSBLTzQUN8SQ';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_stat_value TEXT DEFAULT '98%';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_stat_label TEXT DEFAULT 'Satisfaction des membres dans nos projets communautaires.';

-- Final CTA Section
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS final_cta_title TEXT DEFAULT 'Prêt à faire la différence ?';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS final_cta_description TEXT DEFAULT 'Rejoignez une communauté de jeunes leaders passionnés et engagés pour transformer le Bénin.';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS final_cta_button TEXT DEFAULT 'DEVENIR MEMBRE';

-- ============================================
-- Vérification
-- ============================================
-- SELECT * FROM site_config;
