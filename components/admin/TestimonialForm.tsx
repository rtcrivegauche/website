'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'

type TestimonialData = {
  id?: string
  name: string
  role: string
  promotion: string | null
  quote: string
  avatar_url: string | null
  display_order: number
  is_published: boolean
}

export default function TestimonialForm({ testimonial }: { testimonial: TestimonialData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    promotion: testimonial?.promotion || '',
    quote: testimonial?.quote || '',
    avatar_url: testimonial?.avatar_url || null,
    display_order: testimonial?.display_order || 0,
    is_published: testimonial?.is_published ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const payload = {
        name: formData.name,
        role: formData.role,
        promotion: formData.promotion || null,
        quote: formData.quote,
        avatar_url: formData.avatar_url,
        display_order: formData.display_order,
        is_published: formData.is_published,
      }

      if (testimonial?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', testimonial.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([payload])
        
        if (error) throw error
      }

      router.push('/admin/temoignages')
      router.refresh()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!testimonial?.id) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id)
      
      if (error) throw error
      
      router.push('/admin/temoignages')
      router.refresh()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Nom de la personne *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Marc, Inès..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Rôle / Poste *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Secrétaire Générale, Donateur..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Promotion / Sous-titre
            </label>
            <input
              type="text"
              value={formData.promotion}
              onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Promotion 2024-2025, Partenaire Externe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploader
              value={formData.avatar_url}
              onChange={(url) => setFormData({ ...formData, avatar_url: url })}
              entityType="members"
              entityId={testimonial?.id}
              label="Photo de profil / Avatar (R2)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Témoignage (Citation) *
            </label>
            <textarea
              required
              rows={4}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Saisissez la citation ou le témoignage complet de la personne..."
            />
          </div>

          <div className="flex items-center md:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Publier (Visible immédiatement sur la page d'accueil)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : testimonial ? 'Mettre à jour' : 'Ajouter le témoignage'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>

        {testimonial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
