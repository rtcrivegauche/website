-- ============================================
-- Migration: Créer la table gallery_items
-- Description: Table pour stocker les éléments de la galerie
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  category TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_items(display_order);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_gallery_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gallery_items_updated_at ON gallery_items;
CREATE TRIGGER gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_items_updated_at();

-- RLS Policies
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les items actifs
CREATE POLICY "gallery_items_public_read" ON gallery_items
  FOR SELECT USING (is_active = true);

-- Modification pour éditeurs/admins
CREATE POLICY "gallery_items_all_editor" ON gallery_items
  FOR ALL USING (is_editor_or_admin());

-- Commentaires
COMMENT ON TABLE gallery_items IS 'Éléments de la galerie (photos, vidéos)';
COMMENT ON COLUMN gallery_items.title IS 'Titre de l''élément';
COMMENT ON COLUMN gallery_items.description IS 'Description de l''élément';
COMMENT ON COLUMN gallery_items.media_url IS 'URL du média (image ou vidéo)';
COMMENT ON COLUMN gallery_items.media_type IS 'Type de média (image, video)';
COMMENT ON COLUMN gallery_items.category IS 'Catégorie (Événements, Actions, Vie du club, etc.)';
COMMENT ON COLUMN gallery_items.tags IS 'Tags pour filtrer les éléments';
COMMENT ON COLUMN gallery_items.is_active IS 'Élément actif et visible';
COMMENT ON COLUMN gallery_items.display_order IS 'Ordre d''affichage';
