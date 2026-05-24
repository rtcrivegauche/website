# Guide : Pages personnalisées + Tally

## ✅ Ce qui a été implémenté

### 1. CTA Hero dynamiques
- URLs des boutons configurables depuis la base de données
- Valeurs par défaut : `/membres` et `/actions`
- Migration : `04-add-cta-urls-to-site-config.sql`

### 2. Système de pages personnalisées
- Table `custom_pages` avec support embed codes
- Route publique `/p/[slug]` pour afficher les pages
- Composant `TallyEmbed` pour intégrer Tally facilement
- Migration : `05-create-custom-pages-table.sql`

### 3. Interface admin complète
- `/admin/pages` - Liste des pages
- `/admin/pages/new` - Créer une page
- `/admin/pages/[id]` - Modifier une page
- Formulaire avec prévisualisation du slug

## 🚀 Comment utiliser

### Étape 1 : Exécuter les migrations SQL

1. Allez sur **Supabase Dashboard** → **SQL Editor**
2. Exécutez dans l'ordre :
   ```sql
   -- Migration 04
   -- Copier le contenu de supabase/migrations/04-add-cta-urls-to-site-config.sql
   
   -- Migration 05
   -- Copier le contenu de supabase/migrations/05-create-custom-pages-table.sql
   ```

### Étape 2 : Créer un formulaire Tally

1. Allez sur https://tally.so
2. Créez votre formulaire "Rejoindre le club"
3. Ajoutez les champs nécessaires (nom, email, téléphone, motivation, etc.)
4. Cliquez sur **Share** → **Embed** → **Full page**
5. Copiez le code HTML complet

### Étape 3 : Créer la page dans l'admin

1. Connectez-vous à `/admin/login`
2. Allez sur **Pages** dans le menu
3. Cliquez sur **Nouvelle page**
4. Remplissez :
   - **Titre** : `Rejoindre le Rotaract Cica`
   - **Slug** : `rejoindre-le-club`
   - **Description** : `Formulaire d'inscription pour devenir membre`
   - **Type de contenu** : `Code intégré`
   - **Code HTML** : Collez le code Tally
   - **Publier** : ✅ Cochez la case
5. Cliquez sur **Créer la page**

### Étape 4 : Configurer le bouton CTA

#### Option A : Via SQL (rapide)
```sql
UPDATE site_config 
SET hero_cta_primary_url = '/p/rejoindre-le-club'
WHERE id = (SELECT id FROM site_config LIMIT 1);
```

#### Option B : Via interface admin (à venir)
Créer une page `/admin/configuration` pour modifier ces valeurs

### Étape 5 : Tester

1. Allez sur la page d'accueil `/`
2. Cliquez sur **"REJOINDRE LE CLUB"**
3. Vous devriez voir le formulaire Tally en pleine page
4. Remplissez et soumettez le formulaire
5. Les données sont envoyées à Tally

### Étape 6 : Récupérer les soumissions

1. Allez sur **Tally Dashboard**
2. Sélectionnez votre formulaire
3. Cliquez sur **Responses**
4. Exportez en CSV ou intégrez avec Zapier/Make

## 📝 Exemples d'utilisation

### Exemple 1 : Formulaire Tally full page

```tsx
// La page /p/rejoindre-le-club affiche automatiquement
// le formulaire Tally en pleine page
```

### Exemple 2 : Vidéo YouTube intégrée

```html
<!-- Code embed à mettre dans le champ "Code HTML" -->
<div style="padding: 56.25% 0 0 0; position: relative;">
  <iframe 
    src="https://www.youtube.com/embed/VIDEO_ID" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0" 
    allow="autoplay; fullscreen" 
    allowfullscreen>
  </iframe>
</div>
```

### Exemple 3 : Google Forms

```html
<iframe 
  src="https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true" 
  width="100%" 
  height="1200" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0">
  Chargement…
</iframe>
```

## 🎨 Personnalisation Tally

### Paramètres URL disponibles

- `transparentBackground=1` - Fond transparent
- `hideTitle=1` - Masquer le titre
- `alignLeft=1` - Aligner à gauche
- `hideDescription=1` - Masquer la description

Exemple :
```
https://tally.so/r/YOUR_FORM_ID?transparentBackground=1&hideTitle=1
```

### Hidden fields (tracking)

Ajoutez des champs cachés dans Tally pour tracker :
- Source de la visite
- Paramètres UTM
- Page d'origine

Tally récupère automatiquement les query parameters !

## 🔒 Sécurité

- ✅ RLS activé sur `custom_pages`
- ✅ Seuls les admins/éditeurs peuvent créer/modifier
- ✅ Pages publiées accessibles publiquement
- ⚠️ Validez les embed codes avant publication (risque XSS)

## 🎯 Prochaines étapes

### Phase 8 : SEO
- [ ] Métadonnées dynamiques (✅ Déjà fait pour pages personnalisées)
- [ ] Sitemap XML
- [ ] Robots.txt
- [ ] Open Graph images
- [ ] Schema.org markup

### Phase 9 : Déploiement
- [ ] Configuration Vercel
- [ ] Variables d'environnement production
- [ ] Domaine personnalisé
- [ ] Analytics

## 💡 Astuces

### Créer plusieurs formulaires

Vous pouvez créer plusieurs pages avec différents formulaires :
- `/p/rejoindre-le-club` - Formulaire d'adhésion
- `/p/contact` - Formulaire de contact
- `/p/partenariat` - Demande de partenariat
- `/p/don` - Formulaire de don

### Utiliser avec les CTA

N'importe quel bouton peut pointer vers une page personnalisée :
- Boutons Hero
- Boutons dans le contenu
- Liens dans le footer
- Call-to-action dans les articles

### Analyser les conversions

Utilisez les hidden fields Tally pour tracker :
```
/p/rejoindre-le-club?source=hero&campaign=homepage
```

Tally enregistrera automatiquement `source=hero` et `campaign=homepage` !

## 🆘 Dépannage

### La page ne s'affiche pas
- Vérifiez que `is_published = true`
- Vérifiez le slug (pas d'espaces, pas de caractères spéciaux)
- Vérifiez les politiques RLS dans Supabase

### Le formulaire Tally ne charge pas
- Vérifiez que le code embed est complet
- Vérifiez l'ID du formulaire Tally
- Testez le formulaire directement sur Tally

### Erreur 404
- Vérifiez que la migration 05 a été exécutée
- Vérifiez que la page existe dans `custom_pages`
- Redémarrez le serveur Next.js

## 📚 Ressources

- [Documentation Tally](https://tally.so/help)
- [Tally Embed Options](https://tally.so/help/embed-a-form)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
