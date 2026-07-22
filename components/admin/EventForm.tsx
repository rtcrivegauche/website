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

type EventData = {
  id?: string
  title: string
  slug: string
  description: string
  description_json?: any | null
  event_date: string
  location: string
  location_address: string
  featured_image_url: string
  speaker_name: string
  speaker_photo_url: string
  speaker_title: string
  category: string
  max_attendees: number | string
  registration_url: string
  google_calendar_url?: string
  is_featured: boolean
  is_published: boolean
}

export default function EventForm({ event }: { event: EventData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    description_json: (event as any)?.description_json || null,
    event_date: event?.event_date?.split('T')[0] || '',
    event_time: event?.event_date?.split('T')[1]?.substring(0, 5) || '',
    location: event?.location || '',
    location_address: event?.location_address || '',
    featured_image_url: event?.featured_image_url || '',
    speaker_name: event?.speaker_name || '',
    speaker_photo_url: event?.speaker_photo_url || '',
    speaker_title: event?.speaker_title || '',
    category: event?.category || '',
    max_attendees: event?.max_attendees || '',
    registration_url: event?.registration_url || '',
    google_calendar_url: event?.google_calendar_url || '',
    is_featured: event?.is_featured ?? false,
    is_published: event?.is_published ?? false,
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
      if (!formData.event_date || formData.event_date.trim() === '' || !formData.event_time || formData.event_time.trim() === '') {
        throw new Error('La date et l\'heure de l\'événement sont requises.')
      }

      const eventDateTime = `${formData.event_date}T${formData.event_time}:00`
      
      const dataToSave = {
        ...formData,
        event_date: eventDateTime,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees as string) : null,
      }
      
      delete (dataToSave as any).event_time

      if (event?.id) {
        const { error } = await supabase.from('events').update(dataToSave).eq('id', event.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert([dataToSave])
        if (error) throw error
      }

      router.push('/admin/evenements')
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input type="date" required value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
          <input type="time" required value={formData.event_time} onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu *</label>
          <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input type="text" value={formData.location_address} onChange={(e) => setFormData({ ...formData, location_address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lien d'inscription (Optionnel)</label>
          <input type="url" value={formData.registration_url} onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lien Google Calendar (Optionnel)</label>
          <input type="url" value={formData.google_calendar_url} onChange={(e) => setFormData({ ...formData, google_calendar_url: e.target.value })} placeholder="https://calendar.google.com/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <RichTextEditor
            value={formData.description_json || formData.description}
            onChange={(data) => setFormData({ ...formData, description: data.html, description_json: data.json })}
            placeholder="Écrivez la description détaillée de l'événement..."
          />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            value={formData.featured_image_url || null}
            onChange={(url) => setFormData({ ...formData, featured_image_url: url || '' })}
            entityType="events"
            entityId={event?.id}
            label="Image à la une"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du conférencier</label>
          <input type="text" value={formData.speaker_name} onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre du conférencier</label>
          <input type="text" value={formData.speaker_title} onChange={(e) => setFormData({ ...formData, speaker_title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            value={formData.speaker_photo_url || null}
            onChange={(url) => setFormData({ ...formData, speaker_photo_url: url || '' })}
            entityType="events"
            entityId={event?.id}
            label="Photo du conférencier"
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
          <span className="text-sm text-gray-700">Mis en avant</span>
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
