# 🗄️ Configuration Supabase - Rotaract Cica

Ce dossier contient tous les fichiers SQL nécessaires pour configurer la base de données Supabase du projet.

## 📋 Fichiers SQL

1. **`schema.sql`** - Schéma complet de la base de données (15 tables)
2. **`rls-policies.sql`** - Politiques de sécurité Row Level Security
3. **`storage-buckets.sql`** - Configuration des buckets de stockage
4. **`seed.sql`** - Données initiales pour le développement

## 🚀 Installation

### Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : `rotaract-cica`
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche (ex: `eu-west-1`)
5. Cliquez sur "Create new project"
6. Attendez que le projet soit provisionné (~2 minutes)

### Étape 2 : Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : Clé publique anonyme
   - **service_role** : Clé de service (gardez-la secrète !)

### Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Copiez .env.example vers .env.local
cp .env.example .env.local
```

Puis remplissez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

### Étape 4 : Exécuter les scripts SQL

Dans l'interface Supabase, allez dans **SQL Editor** et exécutez les fichiers dans cet ordre :

#### 4.1 Créer le schéma

```sql
-- Copiez et collez le contenu de schema.sql
-- Puis cliquez sur "Run"
```

#### 4.2 Appliquer les politiques RLS

```sql
-- Copiez et collez le contenu de rls-policies.sql
-- Puis cliquez sur "Run"
```

#### 4.3 Configurer le stockage

```sql
-- Copiez et collez le contenu de storage-buckets.sql
-- Puis cliquez sur "Run"
```

#### 4.4 Insérer les données de seed (optionnel)

```sql
-- Copiez et collez le contenu de seed.sql
-- Puis cliquez sur "Run"
```

### Étape 5 : Vérifier l'installation

1. Allez dans **Table Editor** dans Supabase
2. Vous devriez voir 15 tables :
   - ✅ site_config
   - ✅ users
   - ✅ roles
   - ✅ members
   - ✅ events
   - ✅ actions
   - ✅ blog_posts
   - ✅ gallery
   - ✅ media
   - ✅ navigation
   - ✅ custom_pages
   - ✅ homepage_sections
   - ✅ testimonials
   - ✅ partners
   - ✅ contact_messages

3. Allez dans **Storage** et vérifiez les buckets :
   - ✅ images
   - ✅ avatars
   - ✅ documents
   - ✅ videos

## 🗂️ Structure de la base de données

### Tables principales

#### 1. **site_config**
Configuration globale du site (nom, logo, contacts, réseaux sociaux, SEO)

#### 2. **users**
Utilisateurs du système (admins, éditeurs) liés à Supabase Auth

#### 3. **roles**
Rôles et permissions (admin, editor, viewer)

#### 4. **members**
Membres du club Rotaract

#### 5. **events**
Événements et réunions

#### 6. **actions**
Actions et projets du club

#### 7. **blog_posts**
Articles de blog et actualités

#### 8. **gallery**
Photos et vidéos de la galerie

#### 9. **media**
Gestion centralisée des médias uploadés

#### 10. **navigation**
Menu de navigation du site

#### 11. **custom_pages**
Pages personnalisées créées par les admins

#### 12. **homepage_sections**
Configuration des sections de la page d'accueil

#### 13. **testimonials**
Témoignages de membres et partenaires

#### 14. **partners**
Partenaires du club

#### 15. **contact_messages**
Messages du formulaire de contact

## 🔒 Sécurité (RLS)

Toutes les tables sont protégées par Row Level Security (RLS) :

- **Public** : Lecture des contenus publiés uniquement
- **Authentifié** : Upload de médias
- **Éditeur** : CRUD sur les contenus
- **Admin** : Accès complet

## 📦 Buckets de stockage

### images
Stockage des images générales (actions, événements, blog)

### avatars
Photos de profil des membres et utilisateurs

### documents
Documents PDF et autres fichiers

### videos
Vidéos de la galerie

## 🔄 Mise à jour du schéma

Pour modifier le schéma après l'installation :

1. Créez un nouveau fichier de migration dans `supabase/migrations/`
2. Nommez-le avec un timestamp : `YYYYMMDDHHMMSS_description.sql`
3. Exécutez-le dans le SQL Editor de Supabase

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## ⚠️ Important

- **Ne commitez JAMAIS** vos clés API dans Git
- Utilisez `.env.local` pour les variables sensibles
- `.env.local` est déjà dans `.gitignore`
- Gardez votre `service_role` key secrète (elle donne un accès complet)

---

**Phase 3 complétée** ✅
Prochaine étape : Phase 4 - Connexion Supabase au Frontend
