'use server'

import { createClient as createSupabaseJs } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function createUserWithRole(formData: {
  email: string
  fullName: string
  roleId: string
  password?: string
}) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        success: false, 
        error: "Variables d'environnement Supabase manquantes dans la configuration." 
      }
    }

    const generatedPassword = formData.password || Math.random().toString(36).substring(2, 10)
    let userId: string | null = null

    // 1. Essai avec le client Admin (si une vraie clé service_role est configurée)
    const isServiceRoleKeyValid = supabaseServiceKey && !supabaseServiceKey.includes('"role":"anon"')

    if (isServiceRoleKeyValid) {
      try {
        const supabaseAdmin = createSupabaseJs(supabaseUrl, supabaseServiceKey!, {
          auth: { autoRefreshToken: false, persistSession: false }
        })

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: formData.email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: { full_name: formData.fullName }
        })

        if (!authError && authData?.user) {
          userId = authData.user.id
        }
      } catch (adminErr) {
        console.warn('Création admin avec service_role a échoué:', adminErr)
      }
    }

    // 2. Fallback avec le client standard si la clé service_role n'est pas disponible
    if (!userId) {
      const supabaseStandard = createSupabaseJs(supabaseUrl, supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      const { data: signUpData, error: signUpError } = await supabaseStandard.auth.signUp({
        email: formData.email,
        password: generatedPassword,
        options: {
          data: { full_name: formData.fullName }
        }
      })

      if (signUpError) {
        console.error('Erreur lors du signUp:', signUpError)
        return { success: false, error: signUpError.message }
      }

      if (signUpData?.user) {
        userId = signUpData.user.id
      }
    }

    if (!userId) {
      return { success: false, error: "Impossible d'obtenir l'identifiant du compte utilisateur." }
    }

    // 3. Insérer le profil dans la table 'users' (rôle associé via la colonne role_id)
    let profileError = null
    try {
      const serverSupabase = await createServerClient()
      const { error } = await serverSupabase
        .from('users')
        .upsert({
          id: userId,
          email: formData.email,
          full_name: formData.fullName,
          role_id: formData.roleId,
          is_active: true
        }, { onConflict: 'id' })
      
      profileError = error
    } catch (e: any) {
      console.warn('Erreur upsert profil via server client, tentative de secours via service role:', e)
    }

    // Fallback direct avec le service role si disponible
    if (profileError && isServiceRoleKeyValid) {
      const supabaseAdmin = createSupabaseJs(supabaseUrl, supabaseServiceKey!)
      const { error: adminProfileErr } = await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          email: formData.email,
          full_name: formData.fullName,
          role_id: formData.roleId,
          is_active: true
        }, { onConflict: 'id' })
      
      profileError = adminProfileErr
    }

    if (profileError) {
      console.error('Erreur finale enregistrement profil:', profileError)
      return { 
        success: false, 
        error: "Le compte Auth a été créé mais l'attribution du profil/rôle a échoué : " + profileError.message 
      }
    }

    return { success: true, userId }
  } catch (err: any) {
    console.error('Exception lors de la création de l\'utilisateur:', err)
    return { success: false, error: err.message || 'Une erreur inattendue est survenue.' }
  }
}

export async function deleteUserWithRole(userRoleId: string, authUserId: string) {
  try {
    const serverSupabase = await createServerClient()
    
    // 1. Supprimer le profil utilisateur (cascade supprimera ou on le fait manuellement)
    const { error: profileError } = await serverSupabase
      .from('users')
      .delete()
      .eq('id', authUserId)

    if (profileError) console.error('Erreur suppression profil:', profileError)

    // 2. Si service role est configuré, supprimer de l'Auth Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && supabaseServiceKey && !supabaseServiceKey.includes('"role":"anon"')) {
      const supabaseAdmin = createSupabaseJs(supabaseUrl, supabaseServiceKey)
      await supabaseAdmin.auth.admin.deleteUser(authUserId)
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
