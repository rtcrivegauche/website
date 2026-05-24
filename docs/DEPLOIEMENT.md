# 🚀 Guide de Déploiement - Rotaract Cica

## Prérequis

- Compte Vercel (gratuit)
- Projet Supabase configuré
- Repository Git (GitHub, GitLab, ou Bitbucket)

---

## 📋 Checklist Pré-Déploiement

### 1. Vérifier les Variables d'Environnement

Assurez-vous que `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

### 2. Tester en Local

```bash
# Build de production
npm run build

# Tester le build
npm run start
```

Vérifiez que tout fonctionne correctement.

---

## 🌐 Déploiement sur Vercel

### Étape 1 : Connecter le Repository

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"New Project"**
3. Importez votre repository Git
4. Sélectionnez le dossier `rotaract-cica`

### Étape 2 : Configuration du Projet

**Framework Preset:** Next.js (détecté automatiquement)

**Build Command:** `npm run build`

**Output Directory:** `.next`

**Install Command:** `npm install`

### Étape 3 : Variables d'Environnement

Dans les **Environment Variables**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
NEXT_PUBLIC_SITE_URL = https://votre-site.vercel.app
```

⚠️ **Important** : Ajoutez ces variables pour **tous les environnements** (Production, Preview, Development)

### Étape 4 : Déployer

Cliquez sur **"Deploy"**

Le déploiement prend environ 2-3 minutes.

---

## 🔧 Configuration Post-Déploiement

### 1. Configurer Supabase

Dans Supabase Dashboard > Authentication > URL Configuration :

**Site URL:** `https://votre-site.vercel.app`

**Redirect URLs:**
```
https://votre-site.vercel.app/admin
https://votre-site.vercel.app/admin/login
```

### 2. Tester l'Authentification

1. Allez sur `https://votre-site.vercel.app/admin/login`
2. Connectez-vous avec vos identifiants
3. Vérifiez que le dashboard fonctionne

### 3. Vérifier les Pages Publiques

- ✅ Page d'accueil : `/`
- ✅ Actions : `/actions`
- ✅ Événements : `/evenements`
- ✅ Blog : `/blog`

---

## 🌍 Configuration Domaine Personnalisé

### Étape 1 : Ajouter le Domaine dans Vercel

1. Dans votre projet Vercel, allez dans **Settings > Domains**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `rotaractcica.org`

### Étape 2 : Configurer les DNS

Chez votre registrar de domaine, ajoutez :

**Type A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Type CNAME Record (pour www):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Étape 3 : Attendre la Propagation

La propagation DNS peut prendre 24-48h.

Vérifiez avec : `https://dnschecker.org`

### Étape 4 : Mettre à Jour Supabase

Dans Supabase, mettez à jour :

**Site URL:** `https://rotaractcica.org`

**Redirect URLs:**
```
https://rotaractcica.org/admin
https://rotaractcica.org/admin/login
https://www.rotaractcica.org/admin
https://www.rotaractcica.org/admin/login
```

---

## 🔄 Déploiements Automatiques

Vercel déploie automatiquement à chaque push sur :

- **main/master** → Production
- **autres branches** → Preview

### Désactiver les Déploiements Auto (optionnel)

Settings > Git > **Ignored Build Step**

---

## 📊 Monitoring et Analytics

### Vercel Analytics

1. Dans votre projet, allez dans **Analytics**
2. Activez **Web Analytics** (gratuit)
3. Consultez les Core Web Vitals

### Supabase Logs

Dashboard Supabase > **Logs** pour voir :
- Requêtes API
- Erreurs
- Performances

---

## 🐛 Dépannage

### Erreur : "Module not found"

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Supabase connection failed"

Vérifiez que les variables d'environnement sont correctes dans Vercel.

### Erreur 500 sur /admin

Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est définie.

### Images ne s'affichent pas

Vérifiez les politiques RLS sur le bucket `images` dans Supabase Storage.

---

## 🔐 Sécurité

### Checklist Sécurité

- ✅ RLS activé sur toutes les tables
- ✅ Service Role Key jamais exposée au client
- ✅ HTTPS activé (automatique avec Vercel)
- ✅ Variables sensibles dans Environment Variables
- ✅ `.env.local` dans `.gitignore`

### Recommandations

1. **Changez les mots de passe** des comptes admin régulièrement
2. **Activez 2FA** sur Supabase et Vercel
3. **Surveillez les logs** pour détecter les activités suspectes
4. **Limitez les permissions** des utilisateurs

---

## 📈 Optimisations

### Performance

- ✅ Images optimisées avec Next.js Image
- ✅ Server Components par défaut
- ✅ Code splitting automatique
- ✅ Caching Supabase

### SEO (à implémenter)

```typescript
// app/page.tsx
export const metadata = {
  title: 'Rotaract Cica - Club de Cotonou Rive Gauche',
  description: 'Servir, Inspirer, Grandir Ensemble',
}
```

---

## 🎯 Prochaines Étapes

1. ✅ Déployer sur Vercel
2. ✅ Configurer le domaine
3. ✅ Tester toutes les fonctionnalités
4. ⏳ Former les administrateurs
5. ⏳ Ajouter du contenu réel
6. ⏳ Activer Analytics
7. ⏳ Optimiser SEO

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Déploiement prêt !** 🚀
