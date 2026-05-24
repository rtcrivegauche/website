'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface MediaFormProps {
  media?: {
    id: string
    title: string
    url: string
    media_type: string
    file_size: number | null
  }
}

export default function MediaForm({ media }: MediaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: media?.title || '',
    url: media?.url || '',
    media_type: media?.media_type || 'image/jpeg',
    file_size: media?.file_size || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      if (media) {
        const { error } = await supabase
          .from('media_items')
          .update(formData)
          .eq('id', media.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('media_items')
          .insert([formData])

        if (error) throw error
      }

      router.push('/admin/media')
      router.refresh()
    } catch (error) {
      console.error('Error saving media:', error)
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
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du média *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="https://..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de média
          </label>
          <select
            value={formData.media_type}
            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            aria-label="Type de média"
          >
            <option value="image/jpeg">Image JPEG</option>
            <option value="image/png">Image PNG</option>
            <option value="image/webp">Image WebP</option>
            <option value="image/svg+xml">Image SVG</option>
            <option value="video/mp4">Vidéo MP4</option>
            <option value="application/pdf">PDF</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille (octets)
          </label>
          <input
            type="number"
            value={formData.file_size}
            onChange={(e) => setFormData({ ...formData, file_size: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : media ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/media')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
