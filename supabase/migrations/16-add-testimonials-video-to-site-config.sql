-- Migration SQL pour ajouter la colonne testimonials_video_url dans site_config
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS testimonials_video_url TEXT;
