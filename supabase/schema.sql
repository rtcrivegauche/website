-- ============================================
-- SCHÉMA DE BASE DE DONNÉES - ROTARACT CICA
-- ============================================
-- Supabase PostgreSQL Schema
-- Créé pour le Club Rotaract de Cotonou Rive Gauche Cica

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABLE: site_config
-- Configuration globale du site
-- ============================================
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'Club Rotaract de Cotonou Rive Gauche Cica',
  site_description TEXT,
  site_logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  google_analytics_id TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. TABLE: roles
-- Rôles et permissions (CRÉÉE EN PREMIER)
-- ============================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TABLE: users
-- Utilisateurs du système (admin, éditeurs)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TABLE: members
-- Membres du club Rotaract
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  position TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  join_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TABLE: events
-- Événements du club
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  location TEXT,
  location_address TEXT,
  featured_image_url TEXT,
  speaker_name TEXT,
  speaker_photo_url TEXT,
  speaker_title TEXT,
  speaker_bio TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  category TEXT,
  max_attendees INTEGER,
  registration_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TABLE: actions
-- Actions/Projets du club
-- ============================================
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  featured_image_url TEXT,
  category TEXT NOT NULL, -- SANTÉ, ÉDUCATION, ENVIRONNEMENT, LEADERSHIP
  start_date DATE,
  end_date DATE,
  location TEXT,
  beneficiaries_count INTEGER,
  budget DECIMAL(10,2),
  partners TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TABLE: blog_posts
-- Articles de blog / Actualités
-- ============================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[],
  author_id UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- en minutes
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. TABLE: gallery
-- Galerie photos/vidéos
-- ============================================
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- image, video
  thumbnail_url TEXT,
  category TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  action_id UUID REFERENCES actions(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. TABLE: media
-- Gestion des médias (fichiers uploadés)
-- ============================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image/jpeg, application/pdf, etc.
  file_size INTEGER NOT NULL, -- en bytes
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. TABLE: navigation
-- Menu de navigation
-- ============================================
CREATE TABLE navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES navigation(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target TEXT DEFAULT '_self', -- _self, _blank
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. TABLE: custom_pages
-- Pages personnalisées
-- ============================================
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  template TEXT DEFAULT 'default', -- default, full-width, etc.
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. TABLE: homepage_sections
-- Configuration des sections de la page d'accueil
-- ============================================
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_name TEXT UNIQUE NOT NULL, -- hero, about, actions, events, etc.
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}', -- Configuration spécifique à chaque section
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. TABLE: testimonials
-- Témoignages de membres/partenaires
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_photo_url TEXT,
  author_position TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. TABLE: partners
-- Partenaires du club
-- ============================================
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  category TEXT, -- Institutionnel, Privé, ONG, etc.
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. TABLE: contact_messages
-- Messages de contact
-- ============================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES pour optimisation des performances
-- ============================================

-- Members
CREATE INDEX idx_members_slug ON members(slug);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_members_is_featured ON members(is_featured);

-- Events
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_events_is_featured ON events(is_featured);

-- Actions
CREATE INDEX idx_actions_slug ON actions(slug);
CREATE INDEX idx_actions_category ON actions(category);
CREATE INDEX idx_actions_is_published ON actions(is_published);
CREATE INDEX idx_actions_is_featured ON actions(is_featured);

-- Blog Posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);

-- Gallery
CREATE INDEX idx_gallery_event_id ON gallery(event_id);
CREATE INDEX idx_gallery_action_id ON gallery(action_id);
CREATE INDEX idx_gallery_is_featured ON gallery(is_featured);

-- Media
CREATE INDEX idx_media_file_type ON media(file_type);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- Navigation
CREATE INDEX idx_navigation_parent_id ON navigation(parent_id);
CREATE INDEX idx_navigation_display_order ON navigation(display_order);

-- Custom Pages
CREATE INDEX idx_custom_pages_slug ON custom_pages(slug);
CREATE INDEX idx_custom_pages_is_published ON custom_pages(is_published);

-- ============================================
-- TRIGGERS pour updated_at automatique
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_updated_at BEFORE UPDATE ON navigation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON custom_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
