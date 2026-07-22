-- Migration SQL pour ajouter les colonnes de personnalisation d'impact, d'À Propos et de l'image OpenGraph à site_config
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_image_url TEXT;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_badge_number TEXT DEFAULT '98%';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_badge_text TEXT DEFAULT 'Satisfaction des membres dans nos projets communautaires.';

-- Chiffres clés de la section Impact
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_1_value INTEGER DEFAULT 15;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_1_suffix TEXT DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_1_label TEXT DEFAULT 'ans d''impact';

ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_2_value INTEGER DEFAULT 100;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_2_suffix TEXT DEFAULT '+';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_2_label TEXT DEFAULT 'actions réalisées';

ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_3_value INTEGER DEFAULT 500;
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_3_suffix TEXT DEFAULT '+';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS stat_3_label TEXT DEFAULT 'personnes touchées';
