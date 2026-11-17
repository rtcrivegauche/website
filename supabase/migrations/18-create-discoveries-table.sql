-- ============================================
-- Migration: Créer la table discoveries (Découvertes & Immersions)
-- Description: Module dédié pour les activités de découverte, visites culturelles, immersions et sorties
-- ============================================

CREATE TABLE IF NOT EXISTS discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  content_json JSONB,
  featured_image_url TEXT,
  discovery_date DATE,
  location TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches et les tris
CREATE INDEX IF NOT EXISTS idx_discoveries_slug ON discoveries(slug);
CREATE INDEX IF NOT EXISTS idx_discoveries_published ON discoveries(is_published);
CREATE INDEX IF NOT EXISTS idx_discoveries_featured ON discoveries(is_featured);
CREATE INDEX IF NOT EXISTS idx_discoveries_date ON discoveries(discovery_date);
CREATE INDEX IF NOT EXISTS idx_discoveries_order ON discoveries(display_order);

-- Trigger pour la mise à jour de updated_at
DROP TRIGGER IF EXISTS update_discoveries_updated_at ON discoveries;
CREATE TRIGGER update_discoveries_updated_at
  BEFORE UPDATE ON discoveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE discoveries ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les découvertes publiées
CREATE POLICY "discoveries_select_public" ON discoveries
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs et administrateurs
CREATE POLICY "discoveries_select_editor" ON discoveries
  FOR SELECT USING (is_editor_or_admin());

-- Gestion complète (INSERT, UPDATE, DELETE) pour éditeurs et administrateurs
CREATE POLICY "discoveries_all_editor" ON discoveries
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- Données d'exemple
-- ============================================
INSERT INTO discoveries (title, slug, description, discovery_date, location, display_order, is_featured, is_published)
VALUES 
  (
    'Immersion Culturelle et Historique à Ouidah',
    'immersion-culturelle-ouidah',
    'Une journée enrichissante à la découverte du patrimoine historique, de la Route des Esclaves et des richesses culturelles du Bénin.',
    CURRENT_DATE - INTERVAL '15 days',
    'Ouidah, Bénin',
    1,
    true,
    true
  ),
  (
    'Visite des Écosystèmes et Rives du Lac Nokoué',
    'visite-ecosystemes-lac-nokoue',
    'Exploration en pirogue et rencontre avec les communautés lacustres de Ganvié pour comprendre les enjeux environnementaux et la biodiversité.',
    CURRENT_DATE - INTERVAL '40 days',
    'Ganvié, Lac Nokoué',
    2,
    true,
    true
  ),
  (
    'Découverte des Métiers Maritimes au Port de Cotonou',
    'decouverte-metiers-maritimes-port-cotonou',
    'Visite guidée des installations portuaires et échanges passionnants sur les chaînes logistiques et le commerce international.',
    CURRENT_DATE - INTERVAL '70 days',
    'Port Autonome de Cotonou',
    3,
    false,
    true
  )
ON CONFLICT (slug) DO NOTHING;
