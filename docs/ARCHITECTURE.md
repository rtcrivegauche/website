# 🏗️ Architecture Technique - Rotaract Cica

## 📐 Vue d'ensemble

Application Next.js 14+ full-stack avec :
- **Frontend** : React Server Components + Client Components
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Styling** : Tailwind CSS v4
- **UI Components** : shadcn/ui
- **Déploiement** : Vercel

---

## 🎯 Principes Architecturaux

### 1. Server-First Architecture
- Utilisation maximale des React Server Components
- Fetch des données côté serveur pour de meilleures performances
- Client Components uniquement pour l'interactivité

### 2. Type Safety
- TypeScript strict
- Types générés depuis le schéma Supabase
- Validation des données

### 3. Sécurité
- Row Level Security (RLS) sur toutes les tables
- Authentification Supabase
- Middleware pour protection des routes admin
- Variables d'environnement pour les secrets

---

## 📁 Structure des Dossiers

```
rotaract-cica/
├── app/                          # App Router Next.js
│   ├── page.tsx                 # Page d'accueil (RSC)
│   ├── layout.tsx               # Layout racine
│   ├── globals.css              # Styles globaux
│   └── admin/                   # Zone admin
│       ├── layout.tsx           # Layout admin (auth required)
│       ├── page.tsx             # Dashboard
│       ├── login/               # Authentification
│       └── [module]/            # Modules CRUD
│
├── components/
│   ├── public/                  # Composants site public
│   │   ├── Header.tsx          # Navigation (Client Component)
│   │   ├── Hero.tsx            # Hero section (RSC)
│   │   ├── ActionsSection.tsx  # Actions (RSC avec data fetch)
│   │   └── ...
│   └── admin/                   # Composants dashboard
│       ├── AdminSidebar.tsx    # Sidebar navigation (Client)
│       └── AdminHeader.tsx     # Header admin (Client)
│
├── lib/
│   ├── supabase/               # Configuration Supabase
│   │   ├── client.ts           # Client browser (Client Components)
│   │   ├── server.ts           # Client serveur (Server Components)
│   │   └── middleware.ts       # Auth middleware
│   ├── actions/                # Server Actions
│   │   ├── members.ts          # Fonctions membres
│   │   ├── events.ts           # Fonctions événements
│   │   └── ...
│   └── utils.ts                # Utilitaires (cn, etc.)
│
├── types/
│   └── database.types.ts       # Types TypeScript générés
│
├── supabase/                   # Scripts SQL
│   ├── schema.sql              # Schéma complet
│   ├── rls-policies.sql        # Politiques de sécurité
│   ├── storage-buckets.sql     # Configuration stockage
│   └── seed.sql                # Données de test
│
└── middleware.ts               # Middleware Next.js (auth)
```

---

## 🔄 Flux de Données

### Page Publique (Server-Side)

```
User Request
    ↓
Next.js Server
    ↓
Server Component (page.tsx)
    ↓
Server Action (lib/actions/members.ts)
    ↓
Supabase Client Server (lib/supabase/server.ts)
    ↓
Supabase Database (RLS appliqué)
    ↓
Data returned
    ↓
Component renders with data
    ↓
HTML sent to client
```

### Dashboard Admin (Protected)

```
User Request to /admin/*
    ↓
Middleware (middleware.ts)
    ↓
Check auth.getUser()
    ↓
If not authenticated → Redirect to /admin/login
    ↓
If authenticated → Continue
    ↓
Admin Layout (app/admin/layout.tsx)
    ↓
Admin Page Component
    ↓
Supabase queries (with RLS)
    ↓
Render admin interface
```

---

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS :

#### Contenu Public
```sql
-- Les utilisateurs non authentifiés peuvent lire les contenus publiés
CREATE POLICY "public_read_published" ON blog_posts
  FOR SELECT USING (is_published = true);
```

#### Contenu Admin
```sql
-- Seuls les éditeurs/admins peuvent modifier
CREATE POLICY "editors_can_edit" ON blog_posts
  FOR ALL USING (is_editor_or_admin());
```

### Middleware Auth

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('/admin/login')
  }
  
  return response
}
```

---

## 📊 Base de Données

### Schéma Relationnel

```
users ──┬─→ blog_posts (author_id)
        ├─→ events (created_by)
        ├─→ actions (created_by)
        └─→ media (uploaded_by)

roles ──→ users (role_id)

events ──→ gallery (event_id)
actions ──→ gallery (action_id)
```

### Indexes Optimisés

```sql
-- Performance queries
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_members_is_featured ON members(is_featured);
```

### Triggers

```sql
-- Auto-update updated_at
CREATE TRIGGER update_members_updated_at 
  BEFORE UPDATE ON members 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎨 Styling

### Tailwind CSS v4

Configuration dans `app/globals.css` :

```css
@import "tailwindcss";
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);

@theme inline {
  --color-primary: #014F43;
  --color-secondary: #22C83A;
  --color-accent: #E72164;
}
```

### Composants shadcn/ui

Utilisation de `cn()` pour merger les classes :

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

---

## 🚀 Performance

### Optimisations Images

```typescript
import Image from 'next/image'

<Image
  src={url}
  alt={title}
  fill
  className="object-cover"
  // Next.js optimise automatiquement
/>
```

### Server Components par défaut

```typescript
// ✅ Server Component (par défaut)
export default async function Page() {
  const data = await fetchData() // Fetch côté serveur
  return <div>{data}</div>
}

// ❌ Client Component (uniquement si nécessaire)
'use client'
export default function InteractiveComponent() {
  const [state, setState] = useState()
  return <button onClick={() => setState()}>Click</button>
}
```

### Caching Supabase

```typescript
// Cache automatique avec Next.js
export const revalidate = 3600 // Revalider toutes les heures

export default async function Page() {
  const data = await supabase.from('posts').select()
  return <div>{data}</div>
}
```

---

## 🧪 Testing

### Structure de Tests (à implémenter)

```
tests/
├── unit/
│   ├── components/
│   └── lib/
├── integration/
│   └── api/
└── e2e/
    └── user-flows/
```

### Exemple Test Unitaire

```typescript
import { render, screen } from '@testing-library/react'
import Header from '@/components/public/Header'

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Accueil')).toBeInTheDocument()
  })
})
```

---

## 📦 Déploiement

### Variables d'Environnement

#### Production (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=https://rotaractcica.org
```

#### Développement (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Build Process

```bash
# Build de production
npm run build

# Vérifier le build
npm run start

# Analyser le bundle
npm run build -- --analyze
```

---

## 🔧 Maintenance

### Migrations Base de Données

Pour modifier le schéma :

1. Créer un fichier de migration :
```sql
-- supabase/migrations/20240524_add_column.sql
ALTER TABLE members ADD COLUMN linkedin_url TEXT;
```

2. Exécuter dans Supabase SQL Editor

3. Mettre à jour les types TypeScript :
```bash
npx supabase gen types typescript --project-id xxx > types/database.types.ts
```

### Logs et Monitoring

- **Vercel Analytics** : Performances et Core Web Vitals
- **Supabase Logs** : Requêtes DB et erreurs
- **Sentry** (optionnel) : Error tracking

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Architecture maintenue et documentée** ✅
