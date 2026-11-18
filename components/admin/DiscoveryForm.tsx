'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'
import MultiImageGalleryPicker from '@/components/admin/MultiImageGalleryPicker'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
})

const ACTIVITY_TYPES = [
  'Immersion culturelle & historique',
  'Excursion nature & écologique',
  'Visite professionnelle & métiers',
  'Sortie récréative & fraternelle',
  'Voyage d\'études & découverte',
  'Autre immersion'
]

type DiscoveryData = {
  id?: string
  title: string
  slug: string
  description?: string | null
  content?: string | null
  content_json?: any | null
  featured_image_url?: string | null
  discovery_date?: string | null
  discovery_time?: string | null
  location?: string | null
  location_address?: string | null
  activity_type?: string | null
  organizer_name?: string | null
  participants_count?: number | string | null
  fee?: string | null
  gallery_images?: string[] | null
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
    discovery_time: discovery?.discovery_time || '',
    location: discovery?.location || '',
    location_address: discovery?.location_address || '',
    activity_type: discovery?.activity_type || ACTIVITY_TYPES[0],
    organizer_name: discovery?.organizer_name || '',
    participants_count: discovery?.participants_count || '',
    fee: discovery?.fee || '',
    gallery_images: discovery?.gallery_images || [],
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
        discovery_time: formData.discovery_time.trim() || null,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        location_address: formData.location_address.trim() || null,
        activity_type: formData.activity_type.trim() || null,
        organizer_name: formData.organizer_name.trim() || null,
        participants_count: formData.participants_count ? parseInt(formData.participants_count as string) : null,
        fee: formData.fee.trim() || null,
        gallery_images: formData.gallery_images || [],
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
      const { error: delError } = await supabase
        .from('discoveries')
        .delete()
        .eq('id', discovery.id)

      if (delError) throw delError

      router.push('/admin/decouvertes')
      router.refresh()
    } catch (err: unknown) {
      console.error('Erreur suppression découverte:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression.')
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'activité / Immersion</label>
          <select
            value={formData.activity_type}
            onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          >
            {ACTIVITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Horaires / Heure (Ex: 08h30 - 16h00)
          </label>
          <input
            type="text"
            value={formData.discovery_time}
            onChange={(e) => setFormData({ ...formData, discovery_time: e.target.value })}
            placeholder="Ex: 08h30 - 16h00"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Lieu / Destination</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ex: Ouidah, Ganvié, Cotonou..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Point de rendez-vous précis / Adresse
          </label>
          <input
            type="text"
            value={formData.location_address}
            onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
            placeholder="Ex: Esplanade Stade de l'Amitié, Embarcadère de Calavi..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tarif / Frais de participation
          </label>
          <input
            type="text"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
            placeholder="Ex: Gratuit, 3 000 FCFA, 5 000 FCFA..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Organisateur / Guide / Partenaire
          </label>
          <input
            type="text"
            value={formData.organizer_name}
            onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
            placeholder="Ex: Commission Activités Extérieures"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de participants (Capacité)
          </label>
          <input
            type="number"
            value={formData.participants_count}
            onChange={(e) => setFormData({ ...formData, participants_count: e.target.value })}
            placeholder="Ex: 25"
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
            label="Photo de couverture principale"
          />
        </div>

        {/* Album / Galerie de photos multiples */}
        <div className="md:col-span-2 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
          <MultiImageGalleryPicker
            images={formData.gallery_images}
            onChange={(imgs) => setFormData({ ...formData, gallery_images: imgs })}
            label="Album Photos & Galerie des Souvenirs"
            description="Ajoutez les photos prises lors de cette découverte pour permettre aux visiteurs de revivre l'activité sous forme d'album interactif."
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
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 border-t border-gray-150">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-4 h-4 text-[#014F43] rounded focus:ring-[#014F43]"
          />
          <span className="text-sm font-semibold text-gray-700">Publié en ligne</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 text-[#014F43] rounded focus:ring-[#014F43]"
          />
          <span className="text-sm font-semibold text-gray-700">Mettre en avant sur la page d'accueil</span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-gray-150">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-[#014F43] text-white rounded-xl hover:bg-[#00362d] transition font-bold disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Enregistrement en cours...' : discovery?.id ? 'Mettre à jour la découverte' : 'Créer la découverte'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Annuler
          </button>
        </div>

        {discovery?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition text-sm font-bold border border-red-200"
          >
            Supprimer cette découverte
          </button>
        )}
      </div>
    </form>
  )
}
