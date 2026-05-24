# 📖 Guide d'Utilisation - Rotaract Cica

## 🚀 Démarrage Rapide

### 1. Installation

```bash
cd rotaract-cica
npm install
```

### 2. Configuration Supabase

#### Créer le projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez vos clés API dans Settings > API

#### Configurer les variables d'environnement
Créez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

#### Exécuter les scripts SQL
Dans Supabase SQL Editor, exécutez dans l'ordre :
1. `supabase/schema.sql` - Créer les tables
2. `supabase/rls-policies.sql` - Sécurité
3. `supabase/storage-buckets.sql` - Stockage
4. `supabase/seed.sql` - Données de test

### 3. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 🎨 Structure du Projet

```
rotaract-cica/
├── app/                          # Routes Next.js
│   ├── page.tsx                 # Page d'accueil
│   ├── globals.css              # Styles globaux
│   └── admin/                   # Dashboard admin
│       ├── login/               # Authentification
│       ├── membres/             # Gestion membres
│       ├── evenements/          # Gestion événements
│       ├── actions/             # Gestion actions
│       └── blog/                # Gestion blog
├── components/
│   ├── public/                  # Composants site public
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ActionsSection.tsx
│   │   ├── FeaturedEvent.tsx
│   │   ├── FeaturedMembers.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── BlogPreview.tsx
│   │   └── Footer.tsx
│   └── admin/                   # Composants dashboard
│       ├── AdminSidebar.tsx
│       └── AdminHeader.tsx
├── lib/
│   ├── supabase/               # Configuration Supabase
│   │   ├── client.ts           # Client browser
│   │   ├── server.ts           # Client serveur
│   │   └── middleware.ts       # Auth middleware
│   └── actions/                # Actions serveur
│       ├── members.ts
│       ├── events.ts
│       ├── actions.ts
│       ├── blog.ts
│       └── gallery.ts
├── types/
│   └── database.types.ts       # Types TypeScript
└── supabase/                   # Scripts SQL
    ├── schema.sql
    ├── rls-policies.sql
    ├── storage-buckets.sql
    └── seed.sql
```

---

## 📊 Base de Données

### Tables Principales

#### 1. **site_config**
Configuration globale du site (nom, logo, contacts, SEO)

#### 2. **members**
Membres du club Rotaract
- `full_name` : Nom complet
- `position` : Poste dans le club
- `photo_url` : Photo de profil
- `is_featured` : Mis en avant sur la page d'accueil
- `is_active` : Membre actif/inactif

#### 3. **events**
Événements et réunions
- `title` : Titre de l'événement
- `event_date` : Date et heure
- `location` : Lieu
- `speaker_name` : Nom du conférencier
- `is_featured` : Affiché sur la page d'accueil
- `is_published` : Visible publiquement

#### 4. **actions**
Actions et projets du club
- `title` : Titre de l'action
- `category` : SANTÉ, ÉDUCATION, ENVIRONNEMENT, LEADERSHIP
- `featured_image_url` : Image principale
- `is_featured` : Affiché sur la page d'accueil
- `is_published` : Visible publiquement

#### 5. **blog_posts**
Articles de blog et actualités
- `title` : Titre de l'article
- `content` : Contenu HTML
- `featured_image_url` : Image à la une
- `is_published` : Publié/Brouillon
- `published_at` : Date de publication

#### 6. **gallery**
Photos et vidéos
- `media_url` : URL du média
- `media_type` : image ou video
- `event_id` : Lié à un événement (optionnel)
- `action_id` : Lié à une action (optionnel)

---

## 🔐 Authentification

### Créer un utilisateur admin

Dans Supabase SQL Editor :

```sql
-- 1. Créer l'utilisateur dans auth.users (via Supabase Dashboard > Authentication)
-- Ou via SQL :
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@rotaractcica.org', crypt('votre_mot_de_passe', gen_salt('bf')), NOW());

-- 2. Ajouter dans la table users avec rôle admin
INSERT INTO users (id, email, full_name, role_id)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@rotaractcica.org'),
  'admin@rotaractcica.org',
  'Administrateur',
  (SELECT id FROM roles WHERE name = 'admin')
);
```

### Se connecter

1. Allez sur [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Entrez vos identifiants
3. Vous serez redirigé vers `/admin`

---

## 🎯 Utilisation du Dashboard

### Navigation

Le dashboard contient 9 sections :

1. **Tableau de bord** - Vue d'ensemble et statistiques
2. **Membres** - Gérer les membres du club
3. **Événements** - Créer et gérer les événements
4. **Actions** - Gérer les actions et projets
5. **Blog** - Publier des articles
6. **Galerie** - Gérer les photos et vidéos
7. **Pages** - Créer des pages personnalisées
8. **Navigation** - Gérer le menu du site
9. **Configuration** - Paramètres généraux du site

### Gestion des Membres

#### Ajouter un membre
1. Allez dans **Membres**
2. Cliquez sur **+ Ajouter un membre**
3. Remplissez le formulaire :
   - Nom complet
   - Poste
   - Photo (upload)
   - Bio
   - Email et téléphone
   - LinkedIn
4. Cochez **Mis en avant** pour l'afficher sur la page d'accueil
5. Cliquez sur **Enregistrer**

#### Modifier un membre
1. Dans la liste, cliquez sur **Modifier**
2. Modifiez les informations
3. Cliquez sur **Enregistrer**

### Gestion des Événements

#### Créer un événement
1. Allez dans **Événements**
2. Cliquez sur **+ Nouvel événement**
3. Remplissez :
   - Titre
   - Description
   - Date et heure
   - Lieu
   - Conférencier (nom, photo, titre)
   - Image à la une
4. Cochez **Mis en avant** pour l'afficher en grand sur la page d'accueil
5. Cochez **Publié** pour le rendre visible
6. Cliquez sur **Publier**

### Gestion des Actions

#### Créer une action
1. Allez dans **Actions**
2. Cliquez sur **+ Nouvelle action**
3. Remplissez :
   - Titre
   - Catégorie (SANTÉ, ÉDUCATION, ENVIRONNEMENT, LEADERSHIP)
   - Description
   - Image
   - Dates de début/fin
   - Lieu
   - Nombre de bénéficiaires
4. Cochez **Mis en avant** pour l'afficher sur la page d'accueil
5. Cliquez sur **Publier**

### Gestion du Blog

#### Publier un article
1. Allez dans **Blog**
2. Cliquez sur **+ Nouvel article**
3. Remplissez :
   - Titre
   - Catégorie
   - Extrait (résumé)
   - Contenu (éditeur riche)
   - Image à la une
   - Tags
4. Cliquez sur **Publier** ou **Enregistrer comme brouillon**

---

## 🎨 Personnalisation

### Couleurs du site

Les couleurs sont définies dans `app/globals.css` :

```css
--primary: #014F43;      /* Vert profond */
--secondary: #22C83A;    /* Vert vif */
--accent: #E72164;       /* Magenta Rotaract */
```

### Police

Police principale : **Plus Jakarta Sans** (Google Fonts)

### Logo

Remplacez le logo dans `public/logo.png` et mettez à jour dans la configuration du site.

---

## 📱 Responsive

Le site est entièrement responsive :
- **Desktop** : Grid layouts, navigation complète
- **Tablet** : Layouts adaptés
- **Mobile** : Carousels horizontaux, menu hamburger

---

## 🚀 Déploiement

### Déployer sur Vercel

1. Connectez votre repository GitHub
2. Importez le projet sur Vercel
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Déployez !

### Configuration du domaine

1. Dans Vercel, allez dans Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

---

## 🔧 Maintenance

### Sauvegardes

Supabase fait des sauvegardes automatiques. Pour une sauvegarde manuelle :
1. Allez dans Supabase Dashboard > Database > Backups
2. Cliquez sur **Create backup**

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix
```

---

## 📞 Support

Pour toute question :
- Email : contact@rotaractcica.org
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)
- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)

---

**Servir • Inspirer • Grandir Ensemble** 🌟
