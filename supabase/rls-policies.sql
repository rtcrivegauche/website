-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Sécurisation des données avec Supabase RLS

-- ============================================
-- Activer RLS sur toutes les tables
-- ============================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid()
    AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vérifier si l'utilisateur est éditeur ou admin
CREATE OR REPLACE FUNCTION is_editor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid()
    AND r.name IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- POLICIES: site_config
-- ============================================

-- Lecture publique
CREATE POLICY "site_config_select_public" ON site_config
  FOR SELECT USING (true);

-- Modification admin uniquement
CREATE POLICY "site_config_update_admin" ON site_config
  FOR UPDATE USING (is_admin());

-- ============================================
-- POLICIES: users
-- ============================================

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Les admins peuvent tout voir
CREATE POLICY "users_select_admin" ON users
  FOR SELECT USING (is_admin());

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Les admins peuvent tout modifier
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (is_admin());

-- ============================================
-- POLICIES: roles
-- ============================================

-- Lecture pour les utilisateurs authentifiés
CREATE POLICY "roles_select_authenticated" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Modification admin uniquement
CREATE POLICY "roles_all_admin" ON roles
  FOR ALL USING (is_admin());

-- ============================================
-- POLICIES: members
-- ============================================

-- Lecture publique des membres actifs
CREATE POLICY "members_select_public" ON members
  FOR SELECT USING (is_active = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "members_select_editor" ON members
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "members_all_editor" ON members
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: events
-- ============================================

-- Lecture publique des événements publiés
CREATE POLICY "events_select_public" ON events
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "events_select_editor" ON events
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "events_all_editor" ON events
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: actions
-- ============================================

-- Lecture publique des actions publiées
CREATE POLICY "actions_select_public" ON actions
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "actions_select_editor" ON actions
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "actions_all_editor" ON actions
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: blog_posts
-- ============================================

-- Lecture publique des articles publiés
CREATE POLICY "blog_posts_select_public" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "blog_posts_select_editor" ON blog_posts
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "blog_posts_all_editor" ON blog_posts
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: gallery
-- ============================================

-- Lecture publique
CREATE POLICY "gallery_select_public" ON gallery
  FOR SELECT USING (true);

-- Modification éditeurs/admins
CREATE POLICY "gallery_all_editor" ON gallery
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: media
-- ============================================

-- Lecture publique
CREATE POLICY "media_select_public" ON media
  FOR SELECT USING (true);

-- Upload pour utilisateurs authentifiés
CREATE POLICY "media_insert_authenticated" ON media
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Modification pour éditeurs/admins
CREATE POLICY "media_update_editor" ON media
  FOR UPDATE USING (is_editor_or_admin());

-- Suppression pour éditeurs/admins
CREATE POLICY "media_delete_editor" ON media
  FOR DELETE USING (is_editor_or_admin());

-- ============================================
-- POLICIES: navigation
-- ============================================

-- Lecture publique des items actifs
CREATE POLICY "navigation_select_public" ON navigation
  FOR SELECT USING (is_active = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "navigation_select_editor" ON navigation
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "navigation_all_editor" ON navigation
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: custom_pages
-- ============================================

-- Lecture publique des pages publiées
CREATE POLICY "custom_pages_select_public" ON custom_pages
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "custom_pages_select_editor" ON custom_pages
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "custom_pages_all_editor" ON custom_pages
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: homepage_sections
-- ============================================

-- Lecture publique des sections visibles
CREATE POLICY "homepage_sections_select_public" ON homepage_sections
  FOR SELECT USING (is_visible = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "homepage_sections_select_editor" ON homepage_sections
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "homepage_sections_all_editor" ON homepage_sections
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: testimonials
-- ============================================

-- Lecture publique des témoignages publiés
CREATE POLICY "testimonials_select_public" ON testimonials
  FOR SELECT USING (is_published = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "testimonials_select_editor" ON testimonials
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "testimonials_all_editor" ON testimonials
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: partners
-- ============================================

-- Lecture publique des partenaires actifs
CREATE POLICY "partners_select_public" ON partners
  FOR SELECT USING (is_active = true);

-- Lecture complète pour éditeurs/admins
CREATE POLICY "partners_select_editor" ON partners
  FOR SELECT USING (is_editor_or_admin());

-- Modification éditeurs/admins
CREATE POLICY "partners_all_editor" ON partners
  FOR ALL USING (is_editor_or_admin());

-- ============================================
-- POLICIES: contact_messages
-- ============================================

-- Insertion publique (formulaire de contact)
CREATE POLICY "contact_messages_insert_public" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Lecture pour éditeurs/admins uniquement
CREATE POLICY "contact_messages_select_editor" ON contact_messages
  FOR SELECT USING (is_editor_or_admin());

-- Modification pour éditeurs/admins
CREATE POLICY "contact_messages_update_editor" ON contact_messages
  FOR UPDATE USING (is_editor_or_admin());

-- Suppression admin uniquement
CREATE POLICY "contact_messages_delete_admin" ON contact_messages
  FOR DELETE USING (is_admin());
