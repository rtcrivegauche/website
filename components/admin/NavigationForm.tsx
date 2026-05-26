'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavigationItem {
  id: string
  label: string
  url: string
  parent_id: string | null
  order_index: number
  is_active: boolean
}

interface NavigationFormProps {
  navItem?: NavigationItem
  parentItems: NavigationItem[]
}

export default function NavigationForm({ navItem, parentItems }: NavigationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    label: navItem?.label || '',
    url: navItem?.url || '',
    parent_id: navItem?.parent_id || '',
    order_index: navItem?.order_index || 0,
    is_active: navItem?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const data = {
      ...formData,
      parent_id: formData.parent_id || null,
    }

    try {
      if (navItem) {
        const { error } = await supabase
          .from('navigation')
          .update(data)
          .eq('id', navItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('navigation')
          .insert([data])

        if (error) throw error
      }

      router.push('/admin/navigation')
      router.refresh()
    } catch (error) {
      console.error('Error saving navigation item:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Libellé *
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL *
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="/exemple ou https://..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent (optionnel)
          </label>
          <select
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            aria-label="Sélectionner un parent"
          >
            <option value="">-- Aucun parent (menu principal) --</option>
            {parentItems
              .filter(item => !navItem || item.id !== navItem.id)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre d'affichage
          </label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Lien actif
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : navItem ? 'Mettre à jour' : 'Créer'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/navigation')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
