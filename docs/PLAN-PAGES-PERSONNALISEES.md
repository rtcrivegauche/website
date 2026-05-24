# Plan d'implémentation : Pages personnalisées + Tally

## Vue d'ensemble

Permettre de créer des pages personnalisées avec :
- Contenu riche (texte, images, vidéos)
- **Embed codes** (Tally, YouTube, Google Forms, etc.)
- URLs personnalisées (`/p/rejoindre-le-club`)
- Gestion depuis le dashboard admin

## Architecture

### 1. Base de données

#### Table `custom_pages`
```sql
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,  -- URL : /p/[slug]
  title TEXT NOT NULL,
  description TEXT,
  
  -- Contenu
  content_type TEXT NOT NULL,  -- 'rich_text', 'embed', 'hybrid'
  rich_content JSONB,          -- Contenu riche (éditeur)
  embed_code TEXT,             -- Code HTML à intégrer (Tally, etc.)
  
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
```

#### Mise à jour `site_config` pour CTA dynamiques
```sql
ALTER TABLE site_config ADD COLUMN hero_cta_primary_url TEXT DEFAULT '/membres';
ALTER TABLE site_config ADD COLUMN hero_cta_secondary_url TEXT DEFAULT '/actions';
```

### 2. Routes Next.js

```
/p/[slug]                    → Page personnalisée publique
/admin/pages                 → Liste des pages (admin)
/admin/pages/new             → Créer une page (admin)
/admin/pages/[id]            → Éditer une page (admin)
```

### 3. Composants

#### `TallyEmbed.tsx`
- Composant pour intégrer Tally (full page ou inline)
- Gestion du script Tally
- Props : `formId`, `mode` (full/inline)

#### `CustomPageRenderer.tsx`
- Affiche le contenu selon `content_type`
- Gère rich_text, embed_code, ou les deux

#### `CustomPageForm.tsx` (Admin)
- Formulaire pour créer/éditer une page
- Éditeur de texte riche (optionnel)
- Champ pour embed code
- Prévisualisation

### 4. Intégration Tally

#### Page `/p/rejoindre-le-club`
```tsx
// Créée via admin avec embed_code Tally
<TallyEmbed 
  formId="ja9BM6" 
  mode="full" 
  transparentBackground={true}
/>
```

#### Configuration Hero CTA
```tsx
// Hero.tsx utilise les URLs depuis site_config
const ctaPrimaryUrl = config?.hero_cta_primary_url || '/membres'
const ctaSecondaryUrl = config?.hero_cta_secondary_url || '/actions'

<Link href={ctaPrimaryUrl}>REJOINDRE LE CLUB</Link>
<Link href={ctaSecondaryUrl}>DÉCOUVRIR NOS ACTIONS</Link>
```

## Flux utilisateur

### Créer une page "Rejoindre le club"

1. **Admin va sur `/admin/pages/new`**
2. Remplit :
   - Slug : `rejoindre-le-club`
   - Titre : `Rejoindre le Rotaract Cica`
   - Type : `embed`
   - Embed code : Code Tally (full page)
3. Publie la page
4. **Admin va sur `/admin/configuration`**
5. Change `hero_cta_primary_url` → `/p/rejoindre-le-club`
6. Sauvegarde

### Utilisateur clique sur "REJOINDRE LE CLUB"

1. Redirigé vers `/p/rejoindre-le-club`
2. Voit le formulaire Tally en pleine page
3. Remplit le formulaire
4. Données envoyées à Tally
5. **Admin récupère les soumissions depuis Tally Dashboard**

## Avantages

✅ **Flexibilité** : Créer n'importe quelle page sans coder
✅ **Tally** : Formulaires puissants sans backend
✅ **Embed codes** : YouTube, Google Forms, Calendly, etc.
✅ **SEO** : Métadonnées personnalisées par page
✅ **Admin friendly** : Interface simple pour non-devs

## Ordre d'implémentation

1. ✅ CTA dynamiques (URLs depuis DB)
2. Migration SQL : `custom_pages` + colonnes `site_config`
3. Route `/p/[slug]` + composant `CustomPageRenderer`
4. Composant `TallyEmbed`
5. Interface admin : liste + formulaire pages
6. Tester avec formulaire Tally
7. SEO (Phase 8)
8. Déploiement (Phase 9)

## Notes techniques

- **Sécurité** : Valider embed codes (XSS)
- **Performance** : Cache des pages publiées
- **Analytics** : Tracker les visites de pages personnalisées
- **Tally** : Utiliser hidden fields pour tracking (UTM, source, etc.)
