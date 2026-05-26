-- =====================================================================
-- MIGRATION SQL : SYSTEME D'UPLOAD CLOUDFLARE R2 & EDITEUR TIPTAP JSONB
-- A exécuter dans l'éditeur SQL de votre Dashboard Supabase
-- =====================================================================

-- 1. Création de la table de gestion des fichiers sur Cloudflare R2
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL, -- 'members', 'events', 'actions', 'blog', 'gallery', 'config', 'editor'
  entity_id UUID,            -- ID optionnel du membre, de l'événement, etc.
  original_name TEXT NOT NULL,
  file_key TEXT NOT NULL,     -- Chemin/clé R2 de la version large (ex: members/main-uuid.webp)
  public_url TEXT NOT NULL,   -- URL d'accès direct de la version large
  thumbnail_key TEXT,         -- Chemin/clé R2 de la version miniature (ex: members/thumb-uuid.webp)
  thumbnail_url TEXT,         -- URL d'accès direct de la version miniature
  mime_type TEXT NOT NULL DEFAULT 'image/webp',
  final_format TEXT NOT NULL DEFAULT 'webp',
  size_bytes INTEGER NOT NULL, -- Taille en octets du fichier final
  width INTEGER,              -- Largeur du fichier principal
  height INTEGER,             -- Hauteur du fichier principal
  bucket TEXT NOT NULL,       -- Nom du bucket R2
  provider TEXT NOT NULL DEFAULT 'cloudflare_r2',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour optimiser les recherches par entité
CREATE INDEX IF NOT EXISTS idx_media_files_entity ON public.media_files(entity_type, entity_id);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
-- A. Lecture publique autorisée pour tout le monde
CREATE POLICY "Lecture publique pour tous" ON public.media_files
  FOR SELECT USING (true);

-- B. Insertion réservée uniquement aux utilisateurs authentifiés (administrateurs connectés)
CREATE POLICY "Insertion reservee aux utilisateurs connectes" ON public.media_files
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- C. Suppression réservée uniquement aux utilisateurs authentifiés
CREATE POLICY "Suppression reservee aux utilisateurs connectes" ON public.media_files
  FOR DELETE USING (auth.role() = 'authenticated');


-- 2. Ajout des colonnes JSONB pour stocker la structure riche Tiptap
-- Permet de garder la source de vérité structurée sans casser le HTML historique

-- A. Table Membres (bio_json)
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS bio_json JSONB;

-- B. Table Événements (description_json)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS description_json JSONB;

-- C. Table Actions (content_json)
ALTER TABLE public.actions ADD COLUMN IF NOT EXISTS content_json JSONB;

-- D. Table Articles de Blog (content_json)
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS content_json JSONB;


-- =====================================================================
-- REMARQUE :
-- L'affichage public s'attend à du contenu HTML textuel brut dans 
-- les colonnes historiques (bio, description, content). Tiptap met
-- à jour les deux colonnes de manière synchrone :
-- - La version HTML dans la colonne classique (ex: content)
-- - La version JSON dans la colonne JSONB (ex: content_json)
-- =====================================================================
