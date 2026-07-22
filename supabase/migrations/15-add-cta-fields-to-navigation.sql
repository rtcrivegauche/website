-- Migration SQL pour ajouter les fonctionnalités de boutons Call to Action (CTA) à la table navigation
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'menu';
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS bg_color TEXT;
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS text_color TEXT;
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS border_color TEXT;
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS is_transparent BOOLEAN DEFAULT false;
ALTER TABLE public.navigation ADD COLUMN IF NOT EXISTS shape TEXT DEFAULT 'rounded-full';
