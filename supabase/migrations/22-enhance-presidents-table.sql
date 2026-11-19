-- ==============================================================================
-- Migration 22 : Enrichissement de la table 'presidents' & Ajout au Menu
-- Permet d'administrer les anciens présidents (Past-Presidents) avec toutes
-- les informations d'un membre (profession, réseaux, etc.) plus leur mandat et thème.
-- 100% NON DESTRUCTIF : utilise 'ADD COLUMN IF NOT EXISTS'.
-- ==============================================================================

-- 1. Ajout des colonnes enrichies (style profil membre + mandat rotarien)
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS citation TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS professional_title TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.presidents ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Index pour accélérer les requêtes
CREATE INDEX IF NOT EXISTS idx_presidents_term ON public.presidents(term);
CREATE INDEX IF NOT EXISTS idx_presidents_order ON public.presidents(display_order);

-- 2. Ajout automatique de 'Past-Présidents' dans la table navigation si non présent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.navigation WHERE LOWER(label) LIKE '%past%president%') THEN
    INSERT INTO public.navigation (label, url, display_order, is_active, type)
    VALUES ('PAST-PRÉSIDENTS', '/past-presidents', 5, true, 'menu');
  END IF;
END $$;
