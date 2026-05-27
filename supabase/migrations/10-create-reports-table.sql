-- ============================================
-- Migration: Créer la table reports (Rapports de réunions) & distinction_reason
-- Description: Permet de stocker les rapports de réunions avec fichier PDF et d'ajouter la colonne de distinction sur les membres.
-- ============================================

-- 1. Ajouter la colonne distinction_reason à la table members si elle n'existe pas
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS distinction_reason TEXT;

-- 2. Créer la table reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT, -- Contenu riche (HTML)
  pdf_url TEXT, -- Lien vers le PDF sur R2
  meeting_date DATE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- RLS pour reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Lecture publique des rapports publiés
CREATE POLICY "reports_select_public" ON public.reports
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "reports_select_editor" ON public.reports
  FOR SELECT USING (is_editor_or_admin());

-- Modifications pour éditeurs/admins
CREATE POLICY "reports_all_editor" ON public.reports
  FOR ALL USING (is_editor_or_admin());

-- Indexation pour accélérer les performances
CREATE INDEX IF NOT EXISTS idx_reports_slug ON public.reports(slug);
CREATE INDEX IF NOT EXISTS idx_reports_meeting_date ON public.reports(meeting_date);
CREATE INDEX IF NOT EXISTS idx_reports_is_published ON public.reports(is_published);
