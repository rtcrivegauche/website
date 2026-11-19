'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { Users, CheckCircle2, RefreshCw } from 'lucide-react'

type TestimonialData = {
  id?: string
  member_id?: string | null
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
  const [membersList, setMembersList] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    member_id: testimonial?.member_id || null,
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    promotion: testimonial?.promotion || '',
    quote: testimonial?.quote || '',
    avatar_url: testimonial?.avatar_url || null,
    display_order: testimonial?.display_order || 0,
    is_published: testimonial?.is_published ?? true,
  })

  useEffect(() => {
    async function loadMembers() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('members')
          .select('id, full_name, photo_url, role_title')
          .order('full_name')
        if (data) setMembersList(data)
      } catch (err) {
        console.error('Erreur chargement membres:', err)
      }
    }
    loadMembers()
  }, [])

  const handleMemberSelect = (selectedId: string) => {
    if (!selectedId) {
      setFormData(prev => ({ ...prev, member_id: null }))
      return
    }

    const member = membersList.find(m => m.id === selectedId)
    if (!member) return

    setFormData(prev => ({
      ...prev,
      member_id: member.id,
      name: member.full_name || prev.name,
      avatar_url: member.photo_url || prev.avatar_url,
      role: member.role_title || prev.role || 'Membre du Club',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const payload = {
        member_id: formData.member_id || null,
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
        {/* Liaison Optionnelle avec un Membre du Club */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 border border-emerald-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#014F43] text-white rounded-lg">
              <Users size={16} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#014F43]">
                Lier à un Membre du Club (Optionnel)
              </label>
              <p className="text-[11px] text-gray-500">
                Pré-remplit automatiquement le nom, le rôle et la photo depuis sa fiche membre.
              </p>
            </div>
          </div>

          <select
            value={formData.member_id || ''}
            onChange={(e) => handleMemberSelect(e.target.value)}
            className="w-full px-4 py-2.5 border border-emerald-300 rounded-xl text-sm bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-[#014F43] focus:border-transparent cursor-pointer"
          >
            <option value="">— Aucun (Témoignage d&apos;un invité, donateur ou externe) —</option>
            {membersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name} {m.role_title ? `• ${m.role_title}` : ''}
              </option>
            ))}
          </select>

          {formData.member_id ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>Témoignage synchronisé avec la fiche membre de la personne.</span>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 italic">
              ℹ️ Mode externe : vous pouvez saisir librement les informations pour toute personne non membre du club.
            </p>
          )}
        </div>

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

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t w-full">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 px-6 py-3.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 text-center"
        >
          {loading ? 'Enregistrement...' : testimonial ? 'Mettre à jour' : 'Ajouter le témoignage'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-center"
        >
          Annuler
        </button>

        {testimonial && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 text-center"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
