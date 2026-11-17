'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
})

type DiscoveryData = {
  id?: string
  title: string
  slug: string
  description?: string | null
  content?: string | null
  content_json?: any | null
  featured_image_url?: string | null
  discovery_date?: string | null
  location?: string | null
  display_order?: number
  is_featured?: boolean
  is_published?: boolean
}

export default function DiscoveryForm({ discovery }: { discovery: DiscoveryData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: discovery?.title || '',
    slug: discovery?.slug || '',
    description: discovery?.description || '',
    content: discovery?.content || '',
    content_json: (discovery as any)?.content_json || null,
    featured_image_url: discovery?.featured_image_url || '',
    discovery_date: discovery?.discovery_date || '',
    location: discovery?.location || '',
    display_order: discovery?.display_order || 0,
    is_featured: discovery?.is_featured ?? false,
    is_published: discovery?.is_published ?? true,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const dataToSave = {
        ...formData,
        discovery_date: formData.discovery_date && formData.discovery_date.trim() !== '' ? formData.discovery_date : null,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        featured_image_url: formData.featured_image_url.trim() || null,
      }

      if (discovery?.id) {
        const { error: updateError } = await supabase
          .from('discoveries')
          .update(dataToSave)
          .eq('id', discovery.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('discoveries')
          .insert([dataToSave])
        if (insertError) throw insertError
      }

      router.push('/admin/decouvertes')
      router.refresh()
    } catch (err: unknown) {
      console.error('Erreur enregistrement découverte:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!discovery?.id) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la découverte "${discovery.title}" ?`)) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('discoveries')
        .delete()
        .eq('id', discovery.id)
      if (deleteError) throw deleteError

      router.push('/admin/decouvertes')
      router.refresh()
    } catch (err: unknown) {
      alert('Erreur lors de la suppression : ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Titre de la découverte / sortie *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
                slug: !discovery?.id ? generateSlug(e.target.value) : formData.slug,
              })
            }
            placeholder="Ex: Immersion au Port de Cotonou"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Identifiant URL (Slug) *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date de l'activité</label>
          <input
            type="date"
            value={formData.discovery_date}
            onChange={(e) => setFormData({ ...formData, discovery_date: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu / Ville</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ex: Ouidah, Ganvié, Cotonou..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ordre d'affichage</label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Résumé court (affiché sur la carte)</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez brièvement cette découverte en 2 ou 3 phrases pour attirer les visiteurs..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            value={formData.featured_image_url || null}
            onChange={(url) => setFormData({ ...formData, featured_image_url: url || '' })}
            entityType="actions"
            entityId={discovery?.id}
            label="Photo de couverture de la découverte"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Récit & Détails complets de la découverte
          </label>
          <RichTextEditor
            value={formData.content_json || formData.content}
            onChange={(data) => setFormData({ ...formData, content: data.html, content_json: data.json })}
            placeholder="Racontez le déroulement de la visite, les découvertes marquantes, les apprentissages et les anecdotes..."
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-6 pt-4 border-t border-gray-150">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-[#014F43] rounded focus:ring-[#014F43]"
            />
            <span>Mettre en avant sur la page d'accueil</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-800">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#22C83A] rounded focus:ring-[#22C83A]"
            />
            <span>Publier immédiatement sur le site</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
        <div>
          {discovery?.id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm transition"
            >
              Supprimer cette découverte
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/decouvertes')}
            disabled={loading}
            className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl text-sm transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            {loading ? 'Enregistrement...' : discovery ? 'Mettre à jour' : 'Créer la découverte'}
          </button>
        </div>
      </div>
    </form>
  )
}
