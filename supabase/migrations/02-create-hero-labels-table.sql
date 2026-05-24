-- ============================================
-- MIGRATION 02 : Créer table hero_labels
-- ============================================
-- Description : Table pour gérer les labels du Hero (badges colorés)
-- À exécuter dans : Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS hero_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-[#014F43]',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Trigger pour updated_at
-- ============================================
CREATE TRIGGER update_hero_labels_updated_at 
  BEFORE UPDATE ON hero_labels 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE hero_labels ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "hero_labels_select_public" ON hero_labels
  FOR SELECT USING (is_active = true);

-- Modification admin uniquement
CREATE POLICY "hero_labels_all_admin" ON hero_labels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role_id IN (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- ============================================
-- Données par défaut
-- ============================================
INSERT INTO hero_labels (text, color, display_order) VALUES
  ('RÉUNIONS STATUTAIRES', 'bg-[#E11A60]', 1),
  ('ACTIONS SOCIALES', 'bg-[#014F43]', 2),
  ('LEADERSHIP & AMITIÉ', 'bg-[#E11A60]', 3);

-- ============================================
-- Vérification
-- ============================================
-- SELECT * FROM hero_labels ORDER BY display_order;
