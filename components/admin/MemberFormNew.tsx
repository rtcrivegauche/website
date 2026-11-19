'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'
import { Award } from 'lucide-react'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
})

type Member = {
  id?: string
  full_name: string
  slug: string
  photo_url: string | null
  role: string | null
  role_title: string | null
  club_position: string | null
  commission: string | null
  professional_title: string | null
  professional_classification: string | null
  company: string | null
  bio: string | null
  bio_json?: any | null
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
  display_order?: number
  is_honorary?: boolean
  honorary_title?: string | null
  status: string
}

export default function MemberForm({ member }: { member: Member | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [linkedMandates, setLinkedMandates] = useState<any[]>([])

  useEffect(() => {
    if (!member?.id) return
    async function loadMandates() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('presidents')
          .select('id, term, theme, is_current, member_id, full_name')
        if (data) {
          const norm = (member?.full_name || '').trim().toLowerCase()
          const matches = data.filter((p: any) => {
            if (p.member_id && p.member_id === member?.id) return true
            const normP = (p.full_name || '').trim().toLowerCase()
            return normP && norm && (normP === norm || norm.includes(normP) || normP.includes(norm))
          })
          setLinkedMandates(matches)
        }
      } catch (e) {
        console.error('Erreur chargement mandats du membre:', e)
      }
    }
    loadMandates()
  }, [member?.id, member?.full_name])
  
  const [formData, setFormData] = useState<Member>({
    full_name: member?.full_name || '',
    slug: member?.slug || '',
    photo_url: member?.photo_url || null,
    role: member?.role || null,
    role_title: member?.role_title || null,
    club_position: member?.club_position || null,
    commission: member?.commission || null,
    professional_title: member?.professional_title || null,
    professional_classification: member?.professional_classification || null,
    company: member?.company || null,
    bio: member?.bio || null,
    bio_json: (member as any)?.bio_json || null,
    skills: member?.skills || [],
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
    display_order: member?.display_order || 0,
    is_honorary: (member as any)?.is_honorary ?? false,
    honorary_title: (member as any)?.honorary_title || '',
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

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((_, i) => i !== index) || []
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      if (member?.id) {
        const { error } = await supabase
          .from('members')
          .update(formData)
          .eq('id', member.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('members')
          .insert([formData])
        
        if (error) throw error
      }

      router.push('/admin/membres')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement'
      setError(errorMessage)
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Informations de base */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Informations de base</h2>

        {linkedMandates.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-100/50 to-amber-50/80 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Mandat(s) Présidentiel(s) Associé(s)
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {linkedMandates.map((m: any) => (
                    <span key={m.id} className="text-xs font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-xs">
                      {m.is_current ? '⭐ Mandat Actuel' : '🏅 Past-Président'} : {m.term} {m.theme ? `(« ${m.theme} »)` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/admin/presidents"
              className="px-3.5 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-xl transition self-start sm:self-auto"
            >
              Gérer dans Past-Présidents →
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUploader
              value={formData.photo_url}
              onChange={(url) => setFormData({ ...formData, photo_url: url })}
              entityType="members"
              entityId={member?.id}
              label="Photo de profil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="alumni">Alumni</option>
              <option value="board">Bureau</option>
              <option value="guest">Invité</option>
              <option value="partner">Partenaire</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d&apos;adhésion
            </label>
            <input
              type="date"
              value={formData.join_date || ''}
              onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Rôle au club */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Rôle au club</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <input
              type="text"
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Membre, Président, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du rôle
            </label>
            <input
              type="text"
              value={formData.role_title || ''}
              onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Président 2024-2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position au club
            </label>
            <input
              type="text"
              value={formData.club_position || ''}
              onChange={(e) => setFormData({ ...formData, club_position: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission
            </label>
            <select
              value={formData.commission || ''}
              onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Communication">Communication</option>
              <option value="Actions">Actions</option>
              <option value="Développement Professionnel">Développement Professionnel</option>
              <option value="Développement du Club">Développement du Club</option>
              <option value="Finance">Finance</option>
              <option value="Protocole">Protocole</option>
            </select>
          </div>
        </div>
      </div>

      {/* Informations professionnelles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Informations professionnelles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre professionnel
            </label>
            <input
              type="text"
              value={formData.professional_title || ''}
              onChange={(e) => setFormData({ ...formData, professional_title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Développeur, Médecin, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classification professionnelle
            </label>
            <input
              type="text"
              value={formData.professional_classification || ''}
              onChange={(e) => setFormData({ ...formData, professional_classification: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="IT, Santé, etc."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise / Organisation
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Biographie & Compétences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Biographie & Compétences</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biographie
          </label>
          <RichTextEditor
            value={formData.bio_json || formData.bio || ''}
            onChange={(data) => {
              setFormData({
                ...formData,
                bio: data.html,
                bio_json: data.json
              })
            }}
            placeholder="Parcours, expériences, passions du membre..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ajouter une compétence"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d]"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="tel"
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin_url || ''}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.facebook_url || ''}
              onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.instagram_url || ''}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Visibilité des contacts sur la page publique</p>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.show_email}
                onChange={(e) => setFormData({ ...formData, show_email: e.target.checked })}
                className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm text-gray-700">Afficher l&apos;email</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.show_phone}
                onChange={(e) => setFormData({ ...formData, show_phone: e.target.checked })}
                className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm text-gray-700">Afficher le téléphone</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.show_socials}
                onChange={(e) => setFormData({ ...formData, show_socials: e.target.checked })}
                className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm text-gray-700">Afficher les réseaux sociaux</span>
            </label>
          </div>
        </div>
      </div>

      {/* Mise en avant */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mise en avant</h2>
        
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
            />
            <span className="text-sm text-gray-700">Membre actif</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
            />
            <span className="text-sm text-gray-700">Mis en avant (page d&apos;accueil)</span>
          </label>
        </div>
      </div>

      {/* Statut Membre d'Honneur & Distinctions */}
      <div className="bg-amber-50/70 rounded-xl shadow-xs border-2 border-amber-300 p-6">
        <div className="flex items-center gap-2.5 mb-3 text-amber-900">
          <span className="text-2xl">👑</span>
          <div>
            <h2 className="text-lg font-bold">Statut & Distinction d&apos;Honneur</h2>
            <p className="text-xs text-amber-800/80">
              Attribuez à ce membre le statut prestigieux de Membre d&apos;Honneur (carte VIP Gold sur le site).
            </p>
          </div>
        </div>
        
        <div className="space-y-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_honorary || false}
              onChange={(e) => setFormData({ ...formData, is_honorary: e.target.checked })}
              className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-bold text-gray-900">
              Définir comme Membre d&apos;Honneur
            </span>
          </label>

          {formData.is_honorary && (
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Titre / Distinction d&apos;Honneur (Optionnel)
              </label>
              <input
                type="text"
                value={formData.honorary_title || ''}
                onChange={(e) => setFormData({ ...formData, honorary_title: e.target.value })}
                placeholder="Ex: Parrain Rotary du Club, Membre Fondateur, Past-Président Émérite..."
                className="w-full px-4 py-2.5 border border-amber-300 bg-white rounded-lg focus:ring-2 focus:ring-amber-500 font-medium text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce titre apparaîtra sur son badge doré sur la page publique des membres.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t w-full">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 px-6 py-3.5 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50 font-bold text-center shadow-sm"
        >
          {loading ? 'Enregistrement...' : member ? 'Mettre à jour' : 'Créer le membre'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
        >
          Annuler
        </button>

        {member && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-bold text-center"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
