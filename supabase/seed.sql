-- ============================================
-- DONNÉES DE SEED - ROTARACT CICA
-- ============================================
-- Données initiales pour le développement et les tests

-- ============================================
-- 1. Rôles
-- ============================================
INSERT INTO roles (id, name, description, permissions) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', 'Administrateur avec tous les droits', '{"all": true}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'editor', 'Éditeur de contenu', '{"content": ["create", "read", "update", "delete"]}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'viewer', 'Lecteur uniquement', '{"content": ["read"]}'::jsonb);

-- ============================================
-- 2. Configuration du site
-- ============================================
INSERT INTO site_config (
  site_name,
  site_description,
  contact_email,
  contact_phone,
  contact_address,
  social_facebook,
  social_instagram,
  social_linkedin,
  meta_title,
  meta_description
) VALUES (
  'Club Rotaract de Cotonou Rive Gauche Cica',
  'Nous formons une nouvelle génération de leaders engagés pour un impact durable au Bénin à travers le service et l''amitié.',
  'contact@rotaractcica.org',
  '+229 XX XX XX XX',
  'Cotonou, Bénin',
  'https://facebook.com/rotaractcica',
  'https://instagram.com/rotaractcica',
  'https://linkedin.com/company/rotaractcica',
  'Rotaract Cica - Servir, Inspirer, Grandir Ensemble',
  'Le Club Rotaract de Cotonou Rive Gauche Cica forme une nouvelle génération de leaders engagés pour un impact durable au Bénin.'
);

-- ============================================
-- 3. Navigation
-- ============================================
INSERT INTO navigation (label, url, display_order, is_active) VALUES
  ('Accueil', '/', 1, true),
  ('Le Club', '/a-propos', 2, true),
  ('Nos Actions', '/actions', 3, true),
  ('Événements', '/evenements', 4, true),
  ('Membres', '/membres', 5, true),
  ('Actualités', '/blog', 6, true),
  ('Contact', '/contact', 7, true);

-- ============================================
-- 4. Sections de la page d''accueil
-- ============================================
INSERT INTO homepage_sections (section_name, is_visible, display_order, config) VALUES
  ('hero', true, 1, '{"title": "Servir Inspirer Grandir Ensemble", "subtitle": "Au Club Rotaract de Cotonou Rive Gauche Cica"}'::jsonb),
  ('labels', true, 2, '{}'::jsonb),
  ('stats', true, 3, '{"years": 15, "actions": 100, "people": 500}'::jsonb),
  ('about', true, 4, '{}'::jsonb),
  ('actions', true, 5, '{}'::jsonb),
  ('events', true, 6, '{}'::jsonb),
  ('members', true, 7, '{}'::jsonb),
  ('gallery', true, 8, '{}'::jsonb),
  ('blog', true, 9, '{}'::jsonb),
  ('cta', true, 10, '{}'::jsonb);

-- ============================================
-- 5. Membres (exemples)
-- ============================================
INSERT INTO members (full_name, slug, position, bio, is_active, is_featured, display_order) VALUES
  (
    'Awa KOUROUMA',
    'awa-kourouma',
    'Présidente 2023-2024',
    'Leader passionnée et engagée pour le développement communautaire.',
    true,
    true,
    1
  ),
  (
    'Jean Dupont',
    'jean-dupont',
    'Protocole',
    'Responsable du protocole et des relations publiques.',
    true,
    false,
    2
  ),
  (
    'Marc ALIDOU',
    'marc-alidou',
    'Secrétaire',
    'Secrétaire général du club.',
    true,
    false,
    3
  );

-- ============================================
-- 6. Actions (exemples)
-- ============================================
INSERT INTO actions (
  title,
  slug,
  description,
  category,
  is_featured,
  is_published,
  display_order
) VALUES
  (
    'Dépistages et Soins Communautaires',
    'depistages-soins-communautaires',
    'Campagnes de dépistage gratuit et soins de santé pour les communautés défavorisées.',
    'SANTÉ',
    true,
    true,
    1
  ),
  (
    'Kits Scolaires et Alphabétisation',
    'kits-scolaires-alphabetisation',
    'Distribution de fournitures scolaires et programmes d''alphabétisation.',
    'ÉDUCATION',
    true,
    true,
    2
  ),
  (
    'Reforestation et Éco-citoyenneté',
    'reforestation-eco-citoyennete',
    'Plantation d''arbres et sensibilisation à la protection de l''environnement.',
    'ENVIRONNEMENT',
    true,
    true,
    3
  ),
  (
    'Formation et Mentorat de Jeunes',
    'formation-mentorat-jeunes',
    'Programmes de formation en leadership et mentorat pour les jeunes.',
    'LEADERSHIP',
    true,
    true,
    4
  );

-- ============================================
-- 7. Événements (exemple)
-- ============================================
INSERT INTO events (
  title,
  slug,
  description,
  event_date,
  location,
  location_address,
  speaker_name,
  speaker_title,
  is_featured,
  is_published,
  category
) VALUES
  (
    'Réunion statutaire',
    'reunion-statutaire-juin-2024',
    'Thème : "Créateurs de contenu : Nouveaux leaders d''influence"',
    '2024-06-24 19:30:00+00',
    'Hôtel Azalaï',
    'Cotonou, Bénin',
    'Blinda Christelle SOHOUNDE',
    'Conférencière Invitée',
    true,
    true,
    'Réunion'
  );

-- ============================================
-- 8. Articles de blog (exemples)
-- ============================================
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  is_published,
  published_at
) VALUES
  (
    'Les clés du leadership moderne',
    'cles-leadership-moderne',
    'Découvrez comment développer vos compétences de leader au 21e siècle.',
    '<p>Le leadership moderne nécessite de nouvelles compétences...</p>',
    'LEADERSHIP',
    true,
    NOW()
  ),
  (
    'Bilan de nos actions 2023',
    'bilan-actions-2023',
    'Retour sur une année riche en projets et en impact communautaire.',
    '<p>L''année 2023 a été marquée par de nombreuses réalisations...</p>',
    'IMPACT',
    true,
    NOW()
  );

-- ============================================
-- 9. Partenaires (exemples)
-- ============================================
INSERT INTO partners (name, description, category, is_active, display_order) VALUES
  ('Rotary International', 'Organisation parente du Rotaract', 'Institutionnel', true, 1),
  ('Mairie de Cotonou', 'Partenaire institutionnel local', 'Institutionnel', true, 2),
  ('ONG Locale', 'Partenaire pour les actions sociales', 'ONG', true, 3);

-- ============================================
-- 10. Témoignages (exemples)
-- ============================================
INSERT INTO testimonials (
  author_name,
  author_position,
  content,
  rating,
  is_published,
  display_order
) VALUES
  (
    'Marie ASSOGBA',
    'Ancienne Présidente',
    'Le Rotaract Cica m''a permis de développer mes compétences en leadership et de créer un impact réel dans ma communauté.',
    5,
    true,
    1
  ),
  (
    'Thomas KOFFI',
    'Membre actif',
    'Une expérience enrichissante qui allie service communautaire et développement personnel.',
    5,
    true,
    2
  );
