-- ==============================================================================
-- Migration 20 : Système complet d'ordre, table découvertes enrichie, galeries d'images
-- Date : Novembre 2026
-- NOTE DE SÉCURITÉ : Ce script est 100% NON DESTRUCTIF.
-- Il utilise 'IF NOT EXISTS' et 'ADD COLUMN IF NOT EXISTS'.
-- AUCUNE de vos données existantes ne sera écrasée ou supprimée.
-- ==============================================================================

-- 1. CRÉATION OU MISE À JOUR DE LA TABLE 'discoveries' (Découvertes & Immersions)
CREATE TABLE IF NOT EXISTS public.discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  content_json JSONB,
  featured_image_url TEXT,
  discovery_date DATE,
  discovery_time TEXT,
  location TEXT,
  location_address TEXT,
  activity_type TEXT,
  organizer_name TEXT,
  participants_count INTEGER,
  fee TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existait déjà avec moins de colonnes, on ajoute les nouvelles en toute sécurité :
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS discovery_time TEXT;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS activity_type TEXT;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS organizer_name TEXT;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS participants_count INTEGER;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS fee TEXT;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.discoveries ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Index pour discoveries
CREATE INDEX IF NOT EXISTS idx_discoveries_slug ON public.discoveries(slug);
CREATE INDEX IF NOT EXISTS idx_discoveries_published ON public.discoveries(is_published);
CREATE INDEX IF NOT EXISTS idx_discoveries_order ON public.discoveries(display_order);
CREATE INDEX IF NOT EXISTS idx_discoveries_date ON public.discoveries(discovery_date);

-- RLS pour discoveries
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "discoveries_select_public" ON public.discoveries;
CREATE POLICY "discoveries_select_public" ON public.discoveries
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "discoveries_select_editor" ON public.discoveries;
CREATE POLICY "discoveries_select_editor" ON public.discoveries
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "discoveries_all_editor" ON public.discoveries;
CREATE POLICY "discoveries_all_editor" ON public.discoveries
  FOR ALL USING (true);


-- 2. AJOUT DES GALERIES D'IMAGES MULTIPLES ET STATUT SUR LES AUTRES MODULES
-- Permet d'associer un album de plusieurs photos à chaque événement, action et article
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.actions ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.actions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'automatique';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';


-- 3. AJOUT DE LA COLONNE 'display_order' SUR TOUTES LES TABLES DE CONTENU
-- (Pour le glissement direct Haut / Bas sans taper de numéros)
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.actions ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;


-- 4. INSERTION D'EXEMPLES DE DÉCOUVERTES (uniquement si elles n'existent pas)
INSERT INTO public.discoveries (
  title, 
  slug, 
  description, 
  discovery_date, 
  discovery_time,
  location, 
  location_address,
  activity_type,
  organizer_name,
  participants_count,
  fee,
  display_order, 
  is_featured, 
  is_published
)
VALUES 
  (
    'Immersion Culturelle et Historique à Ouidah',
    'immersion-culturelle-ouidah',
    'Une journée enrichissante à la découverte du patrimoine historique, de la Route des Esclaves et des richesses culturelles du Bénin.',
    CURRENT_DATE - INTERVAL '15 days',
    '08h00 - 17h30',
    'Ouidah, Bénin',
    'Point de départ : Esplanade du Stade de l''Amitié',
    'Immersion Historique & Culturelle',
    'Commission Activités Extérieures',
    25,
    'Gratuit (Prise en charge club)',
    1,
    true,
    true
  ),
  (
    'Visite des Écosystèmes et Rives du Lac Nokoué',
    'visite-ecosystemes-lac-nokoue',
    'Exploration en pirogue et rencontre avec les communautés lacustres de Ganvié pour comprendre les enjeux environnementaux et la biodiversité.',
    CURRENT_DATE - INTERVAL '40 days',
    '09h00 - 15h00',
    'Ganvié, Lac Nokoué',
    'Embarcadère de Calavi',
    'Excursion Écologique & Environnement',
    'Commission Environnement & Cadre de Vie',
    20,
    '3 000 FCFA',
    2,
    true,
    true
  ),
  (
    'Découverte des Métiers Maritimes au Port de Cotonou',
    'decouverte-metiers-maritimes-port-cotonou',
    'Visite guidée des installations portuaires et échanges passionnants sur les chaînes logistiques et le commerce international.',
    CURRENT_DATE - INTERVAL '70 days',
    '10h00 - 13h00',
    'Port Autonome de Cotonou',
    'Direction Générale du Port Autonome',
    'Visite Professionnelle & Métiers',
    'Commission Développement Professionnel',
    15,
    'Gratuit',
    3,
    false,
    true
  )
ON CONFLICT (slug) DO NOTHING;
