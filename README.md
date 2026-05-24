# 🌟 Site Web - Club Rotaract de Cotonou Rive Gauche Cica

Application web moderne pour le Club Rotaract de Cotonou Rive Gauche Cica, construite avec Next.js, React, TypeScript, Tailwind CSS et Supabase.

## 🎯 À propos

Ce projet transforme le site HTML statique du club en une application web complète avec :
- **Site public** moderne et responsive
- **Dashboard admin** pour gérer tous les contenus
- **Base de données Supabase** PostgreSQL
- **Authentification** et gestion des rôles
- **Mini-CMS** pour gérer le contenu sans toucher au code

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone [url-du-repo]
cd rotaract-cica

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
rotaract-cica/
├── app/                      # Routes Next.js (App Router)
│   ├── page.tsx             # Page d'accueil
│   ├── globals.css          # Styles globaux
│   └── layout.tsx           # Layout principal
├── components/
│   └── public/              # Composants du site public
│       ├── Header.tsx       # Navigation
│       ├── Hero.tsx         # Section hero
│       ├── ImpactStats.tsx  # Statistiques animées
│       ├── AboutPreview.tsx # Section valeurs
│       ├── ActionsSection.tsx
│       ├── FeaturedEvent.tsx
│       ├── FeaturedMembers.tsx
│       ├── GalleryPreview.tsx
│       ├── BlogPreview.tsx
│       ├── FinalCTA.tsx
│       └── Footer.tsx
├── lib/
│   └── utils.ts             # Utilitaires
└── public/                  # Assets statiques
```

## 🎨 Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **UI Components** : shadcn/ui
- **Base de données** : Supabase PostgreSQL (à venir)
- **Authentification** : Supabase Auth (à venir)
- **Storage** : Supabase Storage (à venir)
- **Déploiement** : Vercel (à venir)

## 🎨 Design

### Couleurs principales
- **Vert profond** : `#014F43`
- **Vert vif** : `#22C83A`
- **Magenta Rotaract** : `#E72164`
- **Fond** : `#F1F2F2` avec texture polygonale

### Typographie
- **Police principale** : Plus Jakarta Sans (400, 600, 700, 800)

## 📊 Progression du projet

✅ **Phase 1** : Setup initial (100%)
✅ **Phase 2** : Conversion HTML → React (100%)
⏳ **Phase 3** : Configuration Supabase (0%)
⏳ **Phase 4** : Connexion Frontend (0%)
⏳ **Phase 5** : Auth & Dashboard Admin (0%)
⏳ **Phase 6** : Modules CRUD (0%)
⏳ **Phase 7** : Pages publiques (0%)
⏳ **Phase 8** : Optimisations (0%)
⏳ **Phase 9** : Déploiement (0%)

Voir `PROGRESSION.md` pour plus de détails.

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 📝 Fonctionnalités actuelles

### Site public
- ✅ Page d'accueil complète avec toutes les sections
- ✅ Navigation responsive (desktop + mobile)
- ✅ Animations (fadeInUp, counters)
- ✅ Carousels horizontaux (actions, membres, galerie, blog)
- ✅ Design fidèle à la maquette HTML originale
- ✅ **100% dynamique avec Supabase**

### Dashboard Admin
- ✅ Authentification sécurisée
- ✅ Dashboard avec statistiques
- ✅ Gestion des membres (liste)
- ✅ Protection des routes
- ✅ Navigation complète (9 sections)
- 🔄 Formulaires CRUD (en cours)

### À venir
- Formulaires CRUD complets
- Pages publiques dynamiques (À propos, Actions, Événements, Blog, etc.)
- Éditeur riche pour le blog
- Upload d'images
- Gestion de la galerie
- Pages personnalisées
- SEO dynamique
- Système de permissions avancé

## 📚 Documentation

- **[GUIDE-UTILISATION.md](./GUIDE-UTILISATION.md)** - Guide complet pour les utilisateurs
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentation technique pour les développeurs
- **[PROGRESSION.md](./PROGRESSION.md)** - Suivi détaillé du projet
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions
- **[supabase/README.md](./supabase/README.md)** - Guide d'installation de la base de données

## 🤝 Contribution

Ce projet est développé pour le Club Rotaract de Cotonou Rive Gauche Cica.

## 📄 Licence

© 2024 Club Rotaract de Cotonou Rive Gauche Cica. Tous droits réservés.

---

**Servir • Inspirer • Grandir Ensemble**
