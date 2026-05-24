# Configuration Admin - Rotaract Cica

## Créer un utilisateur administrateur

### Étape 1 : Créer un utilisateur dans Supabase Auth

1. Allez sur votre dashboard Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu latéral, cliquez sur **Authentication** → **Users**
4. Cliquez sur **Add user** → **Create new user**
5. Remplissez :
   - **Email** : `admin@rotaractcica.org` (ou votre email)
   - **Password** : Choisissez un mot de passe sécurisé
   - **Auto Confirm User** : ✅ Cochez cette case
6. Cliquez sur **Create user**
7. **Notez l'UUID de l'utilisateur** (visible dans la colonne ID)

### Étape 2 : Ajouter l'utilisateur à la table users

1. Dans le menu latéral, cliquez sur **SQL Editor**
2. Cliquez sur **New query**
3. Collez et exécutez cette requête (remplacez `USER_UUID` par l'UUID copié) :

```sql
-- Insérer l'utilisateur dans la table users avec le rôle admin
INSERT INTO users (id, email, full_name, role_id)
VALUES (
  'USER_UUID',  -- Remplacez par l'UUID de l'utilisateur créé
  'admin@rotaractcica.org',  -- Email de l'admin
  'Administrateur',  -- Nom complet
  '11111111-1111-1111-1111-111111111111'  -- ID du rôle admin (défini dans seed.sql)
);
```

4. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

### Étape 3 : Vérifier la création

Exécutez cette requête pour vérifier :

```sql
SELECT 
  u.id,
  u.email,
  u.full_name,
  r.name as role
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email = 'admin@rotaractcica.org';
```

Vous devriez voir votre utilisateur avec le rôle `admin`.

## Se connecter

1. Allez sur : http://localhost:3000/admin/login
2. Utilisez les identifiants :
   - **Email** : `admin@rotaractcica.org` (ou l'email que vous avez utilisé)
   - **Mot de passe** : Le mot de passe que vous avez défini

## Identifiants par défaut suggérés

Pour le développement local, vous pouvez utiliser :
- **Email** : `admin@rotaractcica.org`
- **Mot de passe** : `Admin2024!` (à changer en production)

## Dépannage

### Erreur "Invalid login credentials"
- Vérifiez que l'utilisateur existe dans **Authentication** → **Users**
- Vérifiez que l'utilisateur est confirmé (colonne "Email Confirmed")
- Vérifiez que le mot de passe est correct

### Erreur après connexion
- Vérifiez que l'utilisateur existe dans la table `users`
- Vérifiez que le `role_id` correspond au rôle admin
- Vérifiez les politiques RLS dans **Database** → **Policies**

### L'utilisateur ne peut rien modifier
- Vérifiez que le rôle est bien `admin` et non `editor` ou `viewer`
- Exécutez : `SELECT is_admin()` pour tester la fonction helper
