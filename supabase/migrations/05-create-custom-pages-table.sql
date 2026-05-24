-- ============================================
-- Migration: Créer la table custom_pages
-- Description: Permet de créer des pages personnalisées avec embed codes (Tally, etc.)
-- ============================================

-- Supprimer la table si elle existe (pour éviter les conflits)
DROP TABLE IF EXISTS custom_pages CASCADE;

-- Créer la table custom_pages
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Type de contenu
  content_type TEXT NOT NULL CHECK (content_type IN ('rich_text', 'embed', 'hybrid')),
  rich_content JSONB,
  embed_code TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  
  -- État
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_published ON custom_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_custom_pages_created_by ON custom_pages(created_by);

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_custom_pages_updated_at ON custom_pages;
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires
COMMENT ON TABLE custom_pages IS 'Pages personnalisées avec contenu riche ou embed codes';
COMMENT ON COLUMN custom_pages.slug IS 'URL slug unique (ex: rejoindre-le-club)';
COMMENT ON COLUMN custom_pages.content_type IS 'Type de contenu: rich_text, embed, ou hybrid';
COMMENT ON COLUMN custom_pages.embed_code IS 'Code HTML à intégrer (Tally, YouTube, etc.)';

-- ============================================
-- RLS Policies pour custom_pages
-- ============================================

-- Activer RLS
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

-- Lecture publique des pages publiées
CREATE POLICY "custom_pages_select_public" ON custom_pages
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "custom_pages_select_editor" ON custom_pages
  FOR SELECT USING (is_editor_or_admin());

-- Modification pour éditeurs/admins
CREATE POLICY "custom_pages_all_editor" ON custom_pages
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- Données de test
-- ============================================

-- Exemple de page avec embed Tally (à personnaliser)
INSERT INTO custom_pages (
  slug,
  title,
  description,
  content_type,
  embed_code,
  meta_title,
  meta_description,
  is_published
) VALUES (
  'rejoindre-le-club',
  'Rejoindre le Rotaract Cica',
  'Formulaire d''inscription pour devenir membre du Club Rotaract de Cotonou Rive Gauche Cica',
  'embed',
  '<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>Rejoindre le Rotaract Cica</title>
    <script async src="https://tally.so/widgets/embed.js"></script>
    <style type="text/css">
      html { margin: 0; height: 100%; overflow: hidden; }
      iframe { position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: 0; }
    </style>
  </head>
  <body>
    <iframe data-tally-src="https://tally.so/r/YOUR_FORM_ID?transparentBackground=1" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" title="Rejoindre le Rotaract Cica"></iframe>
  </body>
</html>',
  'Rejoindre le Rotaract Cica',
  'Devenez membre du Club Rotaract de Cotonou Rive Gauche Cica et participez à nos actions pour un impact durable',
  false  -- Mettre à true après avoir configuré le vrai formulaire Tally
) ON CONFLICT (slug) DO NOTHING;
