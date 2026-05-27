-- ============================================
-- Migration: Créer la table newsletter_subscribers
-- Description: Permet de stocker et lister les abonnés à la newsletter dans l'administration.
-- ============================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Insertion publique autorisée pour tout le monde (formulaires d'inscription)
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Lecture réservée aux éditeurs et administrateurs
CREATE POLICY "newsletter_select_admin" ON public.newsletter_subscribers
  FOR SELECT USING (is_editor_or_admin());

-- Suppression réservée aux éditeurs et administrateurs
CREATE POLICY "newsletter_delete_admin" ON public.newsletter_subscribers
  FOR DELETE USING (is_editor_or_admin());

-- Indexation
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
