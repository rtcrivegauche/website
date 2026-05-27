'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createUserWithRole } from '@/lib/actions/users'

interface Role {
  id: string
  name: string
}

interface UserRoleFormProps {
  userRole?: {
    id: string
    user_id: string
    role_id: string
  }
  roles: Role[]
}

export default function UserRoleForm({ userRole, roles }: UserRoleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Pour la création complète
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Pour le rôle
  const [roleId, setRoleId] = useState(userRole?.role_id || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()

    try {
      if (userRole) {
        // Mode Modification : mettre à jour uniquement le rôle de l'utilisateur
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role_id: roleId })
          .eq('id', userRole.id)

        if (updateError) throw updateError
        
        setSuccess('Rôle utilisateur mis à jour avec succès !')
        setTimeout(() => {
          router.push('/admin/users')
          router.refresh()
        }, 1500)
      } else {
        // Mode Création Complète : créer l'utilisateur Auth + l'association de rôle
        if (!fullName || !email || !roleId) {
          throw new Error('Veuillez remplir tous les champs obligatoires.')
        }

        const result = await createUserWithRole({
          email,
          fullName,
          roleId,
          password: password || undefined // Si vide, un mot de passe aléatoire sera généré
        })

        if (result.success) {
          setSuccess('Utilisateur créé avec succès !')
          setTimeout(() => {
            router.push('/admin/users')
            router.refresh()
          }, 1500)
        } else {
          setError(result.error || "Une erreur est survenue lors de la création de l'utilisateur.")
        }
      }
    } catch (err: any) {
      console.error('Error saving user role:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {!userRole ? (
          // Mode Création : tous les champs nécessaires
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: Jean Dupont"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: jean.dupont@rotaractcica.org"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe initial (optionnel)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Laisser vide pour générer automatiquement"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 6 caractères. S'il est laissé vide, un mot de passe aléatoire sera généré.
              </p>
            </div>
          </>
        ) : (
          // Mode Modification : affichage des infos
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Utilisateur (Non modifiable)
            </label>
            <input
              type="text"
              value={userRole.user_id}
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
              disabled
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rôle *
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            required
            aria-label="Sélectionner un rôle"
          >
            <option value="">-- Sélectionner un rôle --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50 font-bold"
          >
            {loading ? 'Enregistrement...' : userRole ? 'Mettre à jour' : 'Créer l\'utilisateur'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
