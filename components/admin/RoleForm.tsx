'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RoleFormProps {
  role?: {
    id: string
    name: string
    description: string | null
    permissions: any
  }
}

const AVAILABLE_MENUS = [
  { key: 'menu_dashboard', label: 'Tableau de bord', description: 'Accès au résumé général' },
  { key: 'menu_home', label: "Page d'accueil", description: 'Gestion des sections et mises en avant' },
  { key: 'menu_membres', label: 'Membres', description: 'Gestion des membres du club' },
  { key: 'menu_evenements', label: 'Événements', description: 'Gestion des événements et inscriptions' },
  { key: 'menu_actions', label: 'Actions', description: 'Gestion des actions et projets sociaux' },
  { key: 'menu_blog', label: 'Blog / Actualités', description: 'Gestion des articles de blog' },
  { key: 'menu_galerie', label: 'Galerie', description: 'Gestion de la galerie photo/vidéo' },
  { key: 'menu_pages', label: 'Pages personnalisées', description: 'Gestion des pages additionnelles' },
  { key: 'menu_navigation', label: 'Navigation', description: 'Gestion des liens de menus publics' },
  { key: 'menu_media', label: 'Médias', description: 'Gestion de la bibliothèque de médias' },
  { key: 'menu_messages', label: 'Messages de contact', description: 'Accès aux messages reçus du formulaire de contact' },
  { key: 'menu_users', label: 'Utilisateurs', description: 'Gestion des comptes d\'administration' },
  { key: 'menu_roles', label: 'Rôles & Permissions', description: 'Gestion des privilèges et profils' },
  { key: 'menu_config', label: 'Configuration', description: 'Paramètres généraux du site' },
]

export default function RoleForm({ role }: RoleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Initialiser les permissions à partir du rôle existant ou vide
  const initialPermissions = AVAILABLE_MENUS.reduce((acc, menu) => {
    acc[menu.key] = role?.permissions?.[menu.key] ?? (role?.name === 'admin' ? true : false)
    return acc;
  }, {} as Record<string, boolean>)

  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
  })
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>(initialPermissions)

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    const updated = { ...permissions }
    AVAILABLE_MENUS.forEach(menu => {
      updated[menu.key] = checked
    })
    setPermissions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()

    const dataToSave = {
      ...formData,
      permissions: permissions
    }

    try {
      if (role) {
        const { error: updateError } = await supabase
          .from('roles')
          .update(dataToSave)
          .eq('id', role.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('roles')
          .insert([dataToSave])

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/roles')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error('Error saving role:', err)
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Rôle enregistré avec succès !
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
          Informations du rôle
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du rôle *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: rp, editeur, moderateur"
              required
              disabled={role?.name === 'admin'} // Empêcher de renommer le rôle admin
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: Responsable des Relations Publiques"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Accès aux menus du Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Activez ou désactivez l'affichage des sections d'administration pour ce rôle.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSelectAll(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Tout cocher
            </button>
            <button
              type="button"
              onClick={() => handleSelectAll(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Tout décocher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_MENUS.map((menu) => (
            <div
              key={menu.key}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                permissions[menu.key]
                  ? 'border-[#014F43]/30 bg-[#014F43]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                id={menu.key}
                checked={permissions[menu.key]}
                onChange={(e) => handlePermissionChange(menu.key, e.target.checked)}
                className="mt-1 w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
                disabled={role?.name === 'admin'} // Admin a toujours tous les droits
              />
              <label htmlFor={menu.key} className="flex-1 cursor-pointer select-none">
                <span className="block text-sm font-bold text-gray-900">
                  {menu.label}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {menu.description}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50 font-bold"
        >
          {loading ? 'Enregistrement...' : role ? 'Enregistrer les modifications' : 'Créer le rôle'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/roles')}
          className="px-8 py-3.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
