-- ==============================================================================
-- Migration 23 : Liaison intelligente entre Presidents, Testimonials et Members
-- 100% NON DESTRUCTIF : utilise 'ADD COLUMN IF NOT EXISTS'.
-- Permet de lier un mandat présidentiel ou un témoignage à un membre du club,
-- tout en laissant la possibilité d'avoir un Past-Président ou un Témoignage
-- externe qui n'est plus ou pas membre du club (member_id reste optionnel).
-- ==============================================================================

-- 1. Ajout de la clé étrangère member_id dans public.presidents
ALTER TABLE public.presidents 
  ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_presidents_member_id ON public.presidents(member_id);

-- 2. Ajout de la clé étrangère member_id dans public.testimonials
ALTER TABLE public.testimonials 
  ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_testimonials_member_id ON public.testimonials(member_id);

-- 3. Auto-liaison intelligente des personnes existantes (par correspondance exacte ou partielle du nom)
UPDATE public.presidents p
SET member_id = m.id
FROM public.members m
WHERE p.member_id IS NULL 
  AND (
    LOWER(TRIM(p.full_name)) = LOWER(TRIM(m.full_name))
    OR LOWER(TRIM(m.full_name)) LIKE '%' || LOWER(TRIM(p.full_name)) || '%'
    OR LOWER(TRIM(p.full_name)) LIKE '%' || LOWER(TRIM(m.full_name)) || '%'
  );

UPDATE public.testimonials t
SET member_id = m.id
FROM public.members m
WHERE t.member_id IS NULL 
  AND (
    LOWER(TRIM(t.name)) = LOWER(TRIM(m.full_name))
    OR LOWER(TRIM(m.full_name)) LIKE '%' || LOWER(TRIM(t.name)) || '%'
    OR LOWER(TRIM(t.name)) LIKE '%' || LOWER(TRIM(m.full_name)) || '%'
  );
