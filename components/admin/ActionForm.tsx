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

const CATEGORIES = ['SANTÉ', 'ÉDUCATION', 'ENVIRONNEMENT', 'LEADERSHIP']

type ActionData = {
  id?: string
  title: string
  slug: string
  description: string
  content: string
  content_json?: any | null
  featured_image_url: string
  category: string
  start_date: string
  end_date: string
  location: string
  beneficiaries_count: number | string
  display_order: number
  is_featured: boolean
  is_published: boolean
}

export default function ActionForm({ action }: { action: ActionData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: action?.title || '',
    slug: action?.slug || '',
    description: action?.description || '',
    content: action?.content || '',
    content_json: (action as any)?.content_json || null,
    featured_image_url: action?.featured_image_url || '',
    category: action?.category || 'SANTÉ',
    start_date: action?.start_date || '',
    end_date: action?.end_date || '',
    location: action?.location || '',
    beneficiaries_count: action?.beneficiaries_count || '',
    display_order: action?.display_order || 0,
    is_featured: action?.is_featured ?? false,
    is_published: action?.is_published ?? false,
  })

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const dataToSave = {
        ...formData,
        beneficiaries_count: formData.beneficiaries_count ? parseInt(formData.beneficiaries_count as string) : null,
      }

      if (action?.id) {
        const { error } = await supabase.from('actions').update(dataToSave).eq('id', action.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('actions').insert([dataToSave])
        if (error) throw error
      }

      router.push('/admin/actions')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
          <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
          <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'affichage</label>
          <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
          <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
          <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de bénéficiaires</label>
          <input type="number" value={formData.beneficiaries_count} onChange={(e) => setFormData({ ...formData, beneficiaries_count: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            value={formData.featured_image_url || null}
            onChange={(url) => setFormData({ ...formData, featured_image_url: url || '' })}
            entityType="actions"
            entityId={action?.id}
            label="Image à la une"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
          <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenu détaillé</label>
          <RichTextEditor
            value={formData.content_json || formData.content}
            onChange={(data) => setFormData({ ...formData, content: data.html, content_json: data.json })}
            placeholder="Rédigez le contenu riche de l'action..."
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 text-[#E11A60] rounded" />
          <span className="text-sm text-gray-700">Publié</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 text-[#E11A60] rounded" />
          <span className="text-sm text-gray-700">Mis en avant (page d'accueil)</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E11A60] text-white rounded-lg hover:bg-[#1ab030] transition disabled:opacity-50 font-medium">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
          Annuler
        </button>
      </div>
    </form>
  )
}
