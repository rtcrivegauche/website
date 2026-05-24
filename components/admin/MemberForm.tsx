'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Member = {
  id?: string
  full_name: string
  slug: string
  photo_url: string | null
  role: string | null
  role_title: string | null
  club_position: string | null
  position: string | null
  display_order: number
  commission: string | null
  professional_title: string | null
  professional_classification: string | null
  company: string | null
  bio: string | null
  skills: string[] | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  linkedin_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  show_email: boolean
  show_phone: boolean
  show_socials: boolean
  join_date: string | null
  is_active: boolean
  is_featured: boolean
  featured_order: number
  status: string
}

export default function MemberForm({ member }: { member: Member | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<Member>({
    full_name: member?.full_name || '',
    slug: member?.slug || '',
    photo_url: member?.photo_url || null,
    role: member?.role || null,
    role_title: member?.role_title || null,
    club_position: member?.club_position || null,
    position: member?.position || '',
    display_order: member?.display_order || 0,
    commission: member?.commission || null,
    professional_title: member?.professional_title || null,
    professional_classification: member?.professional_classification || null,
    company: member?.company || null,
    bio: member?.bio || null,
    skills: member?.skills || null,
    email: member?.email || null,
    phone: member?.phone || null,
    whatsapp: member?.whatsapp || null,
    linkedin_url: member?.linkedin_url || null,
    facebook_url: member?.facebook_url || null,
    instagram_url: member?.instagram_url || null,
    show_email: member?.show_email ?? true,
    show_phone: member?.show_phone ?? true,
    show_socials: member?.show_socials ?? true,
    join_date: member?.join_date || null,
    is_active: member?.is_active ?? true,
    is_featured: member?.is_featured ?? false,
    featured_order: member?.featured_order || 0,
    status: member?.status || 'active',
  })

  const generateSlug = (name: string) => {
    return name
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
      
      if (member?.id) {
        // Update
        const { error } = await supabase
          .from('members')
          .update(formData)
          .eq('id', member.id)
        
        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('members')
          .insert([formData])
        
        if (error) throw error
      }

      router.push('/admin/membres')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!member?.id) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', member.id)
      
      if (error) throw error
      
      router.push('/admin/membres')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression')
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom complet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                full_name: e.target.value,
                slug: generateSlug(e.target.value)
              })
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Poste */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poste
          </label>
          <input
            type="text"
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
            placeholder="Président, Secrétaire, etc."
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={formData.linkedin_url || ''}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Photo URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de la photo
          </label>
          <input
            type="url"
            value={formData.photo_url || ''}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biographie
          </label>
          <textarea
            rows={4}
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Date d'adhésion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'adhésion
          </label>
          <input
            type="date"
            value={formData.join_date || ''}
            onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>

        {/* Ordre d'affichage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre d'affichage
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60] focus:border-transparent"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-[#E11A60] border-gray-300 rounded focus:ring-[#E11A60]"
          />
          <span className="text-sm text-gray-700">Membre actif</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 text-[#E11A60] border-gray-300 rounded focus:ring-[#E11A60]"
          />
          <span className="text-sm text-gray-700">Mis en avant (page d'accueil)</span>
        </label>
      </div>

      {/* Boutons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#E11A60] text-white rounded-lg hover:bg-[#1ab030] transition disabled:opacity-50 font-medium"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Annuler
        </button>

        {member?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
