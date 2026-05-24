-- ============================================
-- Migration: Créer la table home_featured_items
-- Description: Permet de configurer les contenus mis en avant sur la page d'accueil
-- ============================================

-- Créer la table home_featured_items
CREATE TABLE IF NOT EXISTS home_featured_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_home_featured_section ON home_featured_items(section_key);
CREATE INDEX IF NOT EXISTS idx_home_featured_active ON home_featured_items(is_active);
CREATE INDEX IF NOT EXISTS idx_home_featured_order ON home_featured_items(order_index);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_home_featured_items_updated_at ON home_featured_items;
CREATE TRIGGER update_home_featured_items_updated_at
  BEFORE UPDATE ON home_featured_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires
COMMENT ON TABLE home_featured_items IS 'Contenus mis en avant sur la page d''accueil';
COMMENT ON COLUMN home_featured_items.section_key IS 'Section de la page d''accueil (featured_event, featured_actions, featured_members, featured_gallery, featured_posts)';
COMMENT ON COLUMN home_featured_items.item_type IS 'Type de contenu (event, action, member, gallery, post)';
COMMENT ON COLUMN home_featured_items.item_id IS 'ID du contenu référencé';

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE home_featured_items ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "home_featured_items_select_public" ON home_featured_items
  FOR SELECT USING (is_active = true);

-- Modification pour éditeurs/admins
CREATE POLICY "home_featured_items_all_editor" ON home_featured_items
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- Données de test
-- ============================================

-- Note: Les données de test seront ajoutées via l'interface admin /admin/home
-- après avoir créé du contenu dans les modules correspondants.
