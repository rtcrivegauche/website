# 📦 Migrations Supabase - Contenu Dynamique

## 🎯 Objectif

Rendre le contenu de la page d'accueil modifiable depuis le dashboard admin.

---

## 📋 Instructions d'Exécution

### Étape 1 : Ouvrir Supabase SQL Editor

1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche

---

### Étape 2 : Exécuter les Migrations dans l'Ordre

#### Migration 01 : Ajouter colonnes à `site_config`

```sql
-- Copier-coller le contenu de : 01-add-site-config-columns.sql
```

**Ce que ça fait :**
- Ajoute 11 nouvelles colonnes à la table `site_config`
- Colonnes pour Hero, About, Final CTA
- Valeurs par défaut = contenu actuel codé en dur

**Vérification :**
```sql
SELECT * FROM site_config;
```

---

#### Migration 02 : Créer table `hero_labels`

```sql
-- Copier-coller le contenu de : 02-create-hero-labels-table.sql
```

**Ce que ça fait :**
- Crée la table `hero_labels`
- Configure RLS (lecture publique, modification admin)
- Insère 3 labels par défaut :
  - RÉUNIONS STATUTAIRES
  - ACTIONS SOCIALES
  - LEADERSHIP & AMITIÉ

**Vérification :**
```sql
SELECT * FROM hero_labels ORDER BY display_order;
```

---

#### Migration 03 : Créer table `about_values`

```sql
-- Copier-coller le contenu de : 03-create-about-values-table.sql
```

**Ce que ça fait :**
- Crée la table `about_values`
- Configure RLS (lecture publique, modification admin)
- Insère 3 valeurs par défaut :
  - Service (HandHeart)
  - Leadership (TrendingUp)
  - Amitié (Users)

**Vérification :**
```sql
SELECT * FROM about_values ORDER BY display_order;
```

---

## ✅ Vérification Finale

Après avoir exécuté les 3 migrations, vérifiez que tout est OK :

```sql
-- 1. Vérifier les nouvelles colonnes
SELECT hero_title, hero_subtitle, about_stat_value FROM site_config;

-- 2. Vérifier les labels
SELECT text, color FROM hero_labels WHERE is_active = true ORDER BY display_order;

-- 3. Vérifier les valeurs
SELECT title, icon_name FROM about_values WHERE is_active = true ORDER BY display_order;
```

---

## 🔄 En Cas d'Erreur

### Erreur : "column already exists"
```sql
-- La colonne existe déjà, pas de problème
-- Passez à la migration suivante
```

### Erreur : "table already exists"
```sql
-- La table existe déjà, pas de problème
-- Passez à la migration suivante
```

### Erreur : "function update_updated_at_column() does not exist"
```sql
-- Exécutez d'abord le fichier schema.sql principal
-- Puis réessayez cette migration
```

---

## 📊 Structure Créée

### Table `site_config` (colonnes ajoutées)

| Colonne | Type | Description |
|---------|------|-------------|
| `hero_title` | TEXT | Titre principal du Hero |
| `hero_subtitle` | TEXT | Description sous le titre |
| `hero_image_url` | TEXT | URL de l'image centrale |
| `hero_cta_primary` | TEXT | Texte bouton principal |
| `hero_cta_secondary` | TEXT | Texte bouton secondaire |
| `about_image_url` | TEXT | URL image section À propos |
| `about_stat_value` | TEXT | Valeur statistique (ex: 98%) |
| `about_stat_label` | TEXT | Label de la statistique |
| `final_cta_title` | TEXT | Titre CTA final |
| `final_cta_description` | TEXT | Description CTA final |
| `final_cta_button` | TEXT | Texte bouton CTA final |

### Table `hero_labels`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `text` | TEXT | Texte du label |
| `color` | TEXT | Classe Tailwind couleur |
| `display_order` | INT | Ordre d'affichage |
| `is_active` | BOOLEAN | Actif ou non |

### Table `about_values`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique |
| `icon_name` | TEXT | Nom icône Lucide |
| `title` | TEXT | Titre de la valeur |
| `description` | TEXT | Description |
| `color` | TEXT | Classe Tailwind couleur |
| `display_order` | INT | Ordre d'affichage |
| `is_active` | BOOLEAN | Actif ou non |

---

## 🚀 Prochaines Étapes

Après avoir exécuté ces migrations :

1. ✅ Les tables sont créées
2. ⏳ Modifier les composants React pour utiliser ces données
3. ⏳ Créer la page admin `/admin/configuration`
4. ⏳ Tester les modifications

---

**Tout est prêt pour l'exécution !** 🎉
