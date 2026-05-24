-- ============================================
-- MIGRATION 03 : Créer table about_values
-- ============================================
-- Description : Table pour gérer les valeurs de la section "À propos"
-- À exécuter dans : Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS about_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  icon_name TEXT NOT NULL, -- Nom de l'icône Lucide : 'HandHeart', 'TrendingUp', 'Users', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-[#014F43]',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Trigger pour updated_at
-- ============================================
CREATE TRIGGER update_about_values_updated_at 
  BEFORE UPDATE ON about_values 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "about_values_select_public" ON about_values
  FOR SELECT USING (is_active = true);

-- Modification admin uniquement
CREATE POLICY "about_values_all_admin" ON about_values
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
INSERT INTO about_values (icon_name, title, description, color, display_order) VALUES
  (
    'HandHeart',
    'Service',
    'Nous mettons nos compétences au profit de la communauté à travers des actions concrètes et durables.',
    'bg-[#014F43]',
    1
  ),
  (
    'TrendingUp',
    'Leadership',
    'Un terrain d''apprentissage unique pour développer ses capacités de gestion, de prise de parole et de stratégie.',
    'bg-[#E11A60]',
    2
  ),
  (
    'Users',
    'Amitié',
    'Plus qu''un club, une famille unie par des valeurs fortes et des moments de partage inoubliables.',
    'bg-[#E11A60]',
    3
  );

-- ============================================
-- Vérification
-- ============================================
-- SELECT * FROM about_values ORDER BY display_order;
