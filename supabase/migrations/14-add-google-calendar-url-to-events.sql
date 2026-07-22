-- Migration pour ajouter le champ google_calendar_url à la table events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS google_calendar_url TEXT;
