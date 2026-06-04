-- ============================================
-- Migration: Créer la table presidents
-- Description: Permet de stocker et d'administrer dynamiquement les présidents et leur mot.
-- ============================================

DROP TABLE IF EXISTS public.presidents CASCADE;

CREATE TABLE public.presidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  term TEXT NOT NULL,
  photo_url TEXT,
  message TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.presidents ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tout le monde (visible sur le site public)
DROP POLICY IF EXISTS "presidents_select_public" ON public.presidents;
CREATE POLICY "presidents_select_public" ON public.presidents
  FOR SELECT USING (true);

-- Modifications pour éditeurs/admins
DROP POLICY IF EXISTS "presidents_all_editor" ON public.presidents;
CREATE POLICY "presidents_all_editor" ON public.presidents
  FOR ALL USING (is_editor_or_admin());

-- Indexation et contrainte d'unicité partielle pour garantir un seul président actif à la fois
CREATE UNIQUE INDEX IF NOT EXISTS idx_presidents_current_unique ON public.presidents (is_current) WHERE (is_current = true);

-- Exemple de président initial
INSERT INTO public.presidents (full_name, term, message, is_current)
VALUES 
('Président en exercice', 'Mandat 2025-2026', 'Chers amis, bienvenue sur le site officiel de notre club Rotaract. C''est avec une immense fierté et un profond sens du service que j''assume la présidence de ce mandat. Ensemble, nous continuons d''agir pour impacter positivement nos communautés.', true)
ON CONFLICT DO NOTHING;
