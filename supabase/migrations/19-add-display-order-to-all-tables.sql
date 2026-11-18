-- ============================================
-- Migration 19 : Création complète de 'discoveries' et ajout de 'display_order' à tout le Contenu
-- ============================================

-- 1. CRÉATION DE LA TABLE DISCOVERIES (si pas encore créée)
CREATE TABLE IF NOT EXISTS public.discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  content_json JSONB,
  featured_image_url TEXT,
  discovery_date DATE,
  location TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour discoveries
CREATE INDEX IF NOT EXISTS idx_discoveries_slug ON public.discoveries(slug);
CREATE INDEX IF NOT EXISTS idx_discoveries_published ON public.discoveries(is_published);
CREATE INDEX IF NOT EXISTS idx_discoveries_order ON public.discoveries(display_order);

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


-- 2. AJOUT DE LA COLONNE 'display_order' SUR TOUTES LES TABLES DE CONTENU
-- (Garantit que vous pouvez définir l'ordre #1, #2, #3... partout)

ALTER TABLE public.members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.actions ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 3. INSERTION D'EXEMPLES DE DÉCOUVERTES (si vide)
INSERT INTO public.discoveries (title, slug, description, discovery_date, location, display_order, is_featured, is_published)
VALUES 
  (
    'Immersion Culturelle et Historique à Ouidah',
    'immersion-culturelle-ouidah',
    'Une journée enrichissante à la découverte du patrimoine historique, de la Route des Esclaves et des richesses culturelles du Bénin.',
    CURRENT_DATE - INTERVAL '15 days',
    'Ouidah, Bénin',
    1,
    true,
    true
  ),
  (
    'Visite des Écosystèmes et Rives du Lac Nokoué',
    'visite-ecosystemes-lac-nokoue',
    'Exploration en pirogue et rencontre avec les communautés lacustres de Ganvié pour comprendre les enjeux environnementaux et la biodiversité.',
    CURRENT_DATE - INTERVAL '40 days',
    'Ganvié, Lac Nokoué',
    2,
    true,
    true
  ),
  (
    'Découverte des Métiers Maritimes au Port de Cotonou',
    'decouverte-metiers-maritimes-port-cotonou',
    'Visite guidée des installations portuaires et échanges passionnants sur les chaînes logistiques et le commerce international.',
    CURRENT_DATE - INTERVAL '70 days',
    'Port Autonome de Cotonou',
    3,
    false,
    true
  )
ON CONFLICT (slug) DO NOTHING;
