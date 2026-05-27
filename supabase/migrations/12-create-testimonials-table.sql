-- ============================================
-- Migration: Créer la table testimonials
-- Description: Permet de stocker et administrer dynamiquement les témoignages des membres et invités.
-- ============================================

DROP TABLE IF EXISTS public.testimonials CASCADE;

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  promotion TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tout le monde (visible sur le site public)
DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;
CREATE POLICY "testimonials_select_public" ON public.testimonials
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
DROP POLICY IF EXISTS "testimonials_select_editor" ON public.testimonials;
CREATE POLICY "testimonials_select_editor" ON public.testimonials
  FOR SELECT USING (is_editor_or_admin());

-- Modifications pour éditeurs/admins
DROP POLICY IF EXISTS "testimonials_all_editor" ON public.testimonials;
CREATE POLICY "testimonials_all_editor" ON public.testimonials
  FOR ALL USING (is_editor_or_admin());

-- Indexation
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);

-- Insérer les témoignages initiaux par défaut
INSERT INTO public.testimonials (name, role, promotion, quote, display_order)
VALUES 
('Aurèle', 'Past-Président', 'Promotion 2023-2024', 'Le Rotaract a totalement redéfini ma vision du leadership. Au-delà des actions de service que nous menons, c''est une école de vie formidable et une famille soudée où chaque membre trouve sa place pour grandir et inspirer.', 1),
('Inès', 'Secrétaire Générale', 'Promotion 2024-2025', 'S''engager au Rotaract Cica, c''est l''opportunité d''agir concrètement pour notre communauté tout en développant des compétences professionnelles précieuses. Chaque projet mené est une victoire humaine collective.', 2),
('Marc', 'Responsable Commission Action', 'Promotion 2024-2025', 'Ce qui me marque le plus au sein du club, c''est l''alchimie unique entre la camaraderie sincère et le professionnalisme de nos réalisations. Servir d''abord n''est pas qu''une devise, c''est notre moteur quotidien.', 3)
ON CONFLICT DO NOTHING;
