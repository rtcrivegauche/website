-- ============================================
-- Migration: Ajouter les champs manquants à la table members
-- Description: Compléter la table members avec tous les champs nécessaires
-- ============================================

-- Ajouter les nouveaux champs
ALTER TABLE members ADD COLUMN IF NOT EXISTS role_title TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS club_position TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS commission TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS professional_classification TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT true;
ALTER TABLE members ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT true;
ALTER TABLE members ADD COLUMN IF NOT EXISTS show_socials BOOLEAN DEFAULT true;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE members ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Commentaires
COMMENT ON COLUMN members.role_title IS 'Titre/rôle dans le club (ex: Président, Vice-Président, Trésorier)';
COMMENT ON COLUMN members.club_position IS 'Position au sein du club';
COMMENT ON COLUMN members.commission IS 'Commission du membre (ex: Communication, Actions, Développement)';
COMMENT ON COLUMN members.professional_classification IS 'Classification professionnelle Rotaract';
COMMENT ON COLUMN members.company IS 'Entreprise ou organisation';
COMMENT ON COLUMN members.skills IS 'Compétences du membre (array)';
COMMENT ON COLUMN members.whatsapp IS 'Numéro WhatsApp';
COMMENT ON COLUMN members.linkedin_url IS 'URL du profil LinkedIn';
COMMENT ON COLUMN members.facebook_url IS 'URL du profil Facebook';
COMMENT ON COLUMN members.instagram_url IS 'URL du profil Instagram';
COMMENT ON COLUMN members.show_email IS 'Afficher l''email sur la page publique';
COMMENT ON COLUMN members.show_phone IS 'Afficher le téléphone sur la page publique';
COMMENT ON COLUMN members.show_socials IS 'Afficher les réseaux sociaux sur la page publique';
COMMENT ON COLUMN members.is_featured IS 'Membre mis en avant sur la page d''accueil';
COMMENT ON COLUMN members.featured_order IS 'Ordre d''affichage si mis en avant';
COMMENT ON COLUMN members.status IS 'Statut du membre (active, alumni, board, guest, partner, inactive)';

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_members_commission ON members(commission);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_featured ON members(is_featured);
CREATE INDEX IF NOT EXISTS idx_members_featured_order ON members(featured_order);

-- Contrainte pour le statut
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_status_check;
ALTER TABLE members ADD CONSTRAINT members_status_check 
  CHECK (status IN ('active', 'alumni', 'board', 'guest', 'partner', 'inactive'));
