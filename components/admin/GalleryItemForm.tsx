'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type GalleryItem = {
  id?: string
  title: string
  description: string | null
  media_url: string
  media_type: string
  category: string | null
  tags: string[] | null
  is_active: boolean
  display_order: number
}

export default function GalleryItemForm({ item }: { item: GalleryItem | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  
  const [formData, setFormData] = useState<GalleryItem>({
    title: item?.title || '',
    description: item?.description || null,
    media_url: item?.media_url || '',
    media_type: item?.media_type || 'image',
    category: item?.category || null,
    tags: item?.tags || [],
    is_active: item?.is_active ?? true,
    display_order: item?.display_order || 0,
  })

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index) || []
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      if (item?.id) {
        const { error } = await supabase
          .from('gallery_items')
          .update(formData)
          .eq('id', item.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gallery_items')
          .insert([formData])
        
        if (error) throw error
      }

      router.push('/admin/galerie')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item?.id) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', item.id)
      
      if (error) throw error
      
      router.push('/admin/galerie')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l&apos;image *
            </label>
            <input
              type="url"
              required
              value={formData.media_url}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de média
            </label>
            <select
              value={formData.media_type}
              onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            >
              <option value="image">Image</option>
              <option value="video">Vidéo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Événements">Événements</option>
              <option value="Actions">Actions</option>
              <option value="Membres">Membres</option>
              <option value="Réunions">Réunions</option>
              <option value="Formations">Formations</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ajouter un tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d]"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d&apos;affichage
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm text-gray-700">Image active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : item ? 'Mettre à jour' : 'Créer'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>

        {item && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
