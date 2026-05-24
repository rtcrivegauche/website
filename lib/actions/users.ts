'use server'

import { createClient } from '@supabase/supabase-js'

export async function createUserWithRole(formData: {
  email: string
  fullName: string
  roleId: string
  password?: string
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL ou Service Role Key manquante dans les variables d\'environnement.')
  }

  // Utiliser le client admin pour pouvoir créer directement l'utilisateur
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password || Math.random().toString(36).substring(2, 10), // Générer si absent
    email_confirm: true, // Confirmer automatiquement pour qu'il puisse se connecter tout de suite
    user_metadata: {
      full_name: formData.fullName
    }
  })

  if (authError) {
    console.error('Erreur de création Auth:', authError)
    throw new Error(authError.message)
  }

  const user = authData.user

  // 2. Assigner le rôle à l'utilisateur dans la table user_roles
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .insert([
      {
        user_id: user.id,
        role_id: formData.roleId
      }
    ])

  if (roleError) {
    console.error('Erreur d\'association de rôle:', roleError)
    // Nettoyage de l'utilisateur Auth si l'association échoue
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    throw new Error('Impossible d\'associer le rôle à l\'utilisateur.')
  }

  return { success: true, userId: user.id }
}

export async function deleteUserWithRole(userRoleId: string, authUserId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL ou Service Role Key manquante dans les variables d\'environnement.')
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // 1. Supprimer l'association de rôle
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .eq('id', userRoleId)

  if (roleError) throw roleError

  // 2. Supprimer l'utilisateur Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId)
  if (authError) {
    console.error('Erreur lors de la suppression de l\'utilisateur Auth:', authError)
    // On ne bloque pas si c'est déjà supprimé de l'Auth
  }

  return { success: true }
}
