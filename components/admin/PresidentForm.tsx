'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'
import { 
  User, 
  Calendar, 
  Briefcase, 
  Award, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Star,
  Quote,
  Trash2,
  Users,
  RefreshCw
} from 'lucide-react'

const LinkedinIcon = ({ className = '', size = 16 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const FacebookIcon = ({ className = '', size = 16 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = ({ className = '', size = 16 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export type PresidentData = {
  id?: string
  member_id?: string | null
  full_name: string
  term: string
  photo_url: string | null
  theme?: string | null
  citation?: string | null
  professional_title?: string | null
  company?: string | null
  message: string
  achievements?: string | null
  bio?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  linkedin_url?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  display_order?: number
  is_current: boolean
}

export default function PresidentForm({ president }: { president: PresidentData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [membersList, setMembersList] = useState<any[]>([])

  const [formData, setFormData] = useState<PresidentData>({
    member_id: president?.member_id || null,
    full_name: president?.full_name || '',
    term: president?.term || '',
    photo_url: president?.photo_url || null,
    theme: president?.theme || '',
    citation: president?.citation || '',
    professional_title: president?.professional_title || '',
    company: president?.company || '',
    message: president?.message || '',
    achievements: president?.achievements || '',
    bio: president?.bio || '',
    email: president?.email || '',
    phone: president?.phone || '',
    whatsapp: president?.whatsapp || '',
    linkedin_url: president?.linkedin_url || '',
    facebook_url: president?.facebook_url || '',
    instagram_url: president?.instagram_url || '',
    display_order: president?.display_order || 0,
    is_current: president?.is_current ?? false,
  })

  // Charger la liste des membres pour la liaison optionnelle
  useEffect(() => {
    async function loadMembers() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('members')
          .select('id, full_name, slug, photo_url, role_title, professional_title, professional_classification, company, email, phone, whatsapp, linkedin_url, facebook_url, instagram_url')
          .order('full_name')
        if (data) setMembersList(data)
      } catch (err) {
        console.error('Erreur chargement membres:', err)
      }
    }
    loadMembers()
  }, [])

  // Gérer la sélection d'un membre existant
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
      full_name: member.full_name || prev.full_name,
      photo_url: member.photo_url || prev.photo_url,
      professional_title: member.role_title || member.professional_title || member.professional_classification || prev.professional_title,
      company: member.company || prev.company,
      email: member.email || prev.email,
      phone: member.phone || prev.phone,
      whatsapp: member.whatsapp || prev.whatsapp,
      linkedin_url: member.linkedin_url || prev.linkedin_url,
      facebook_url: member.facebook_url || prev.facebook_url,
      instagram_url: member.instagram_url || prev.instagram_url,
    }))
  }

  // Resynchroniser manuellement avec la fiche membre
  const handleSyncWithMember = () => {
    if (!formData.member_id) return
    const member = membersList.find(m => m.id === formData.member_id)
    if (!member) return

    setFormData(prev => ({
      ...prev,
      full_name: member.full_name || prev.full_name,
      photo_url: member.photo_url || prev.photo_url,
      professional_title: member.role_title || member.professional_title || member.professional_classification || prev.professional_title,
      company: member.company || prev.company,
      email: member.email || prev.email,
      phone: member.phone || prev.phone,
      whatsapp: member.whatsapp || prev.whatsapp,
      linkedin_url: member.linkedin_url || prev.linkedin_url,
      facebook_url: member.facebook_url || prev.facebook_url,
      instagram_url: member.instagram_url || prev.instagram_url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const dataToSave = {
        member_id: formData.member_id || null,
        full_name: formData.full_name.trim(),
        term: formData.term.trim(),
        photo_url: formData.photo_url || null,
        theme: formData.theme?.trim() || null,
        citation: formData.citation?.trim() || null,
        professional_title: formData.professional_title?.trim() || null,
        company: formData.company?.trim() || null,
        message: formData.message.trim(),
        achievements: formData.achievements?.trim() || null,
        bio: formData.bio?.trim() || null,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        whatsapp: formData.whatsapp?.trim() || null,
        linkedin_url: formData.linkedin_url?.trim() || null,
        facebook_url: formData.facebook_url?.trim() || null,
        instagram_url: formData.instagram_url?.trim() || null,
        display_order: parseInt(formData.display_order as any) || 0,
        is_current: Boolean(formData.is_current),
        updated_at: new Date().toISOString()
      }

      // Si défini comme président actuel, désactiver les autres
      if (formData.is_current) {
        const query = supabase
          .from('presidents')
          .update({ is_current: false })

        if (president?.id) {
          query.neq('id', president.id)
        }

        const { error: updateError } = await query
        if (updateError) throw updateError
      }

      if (president?.id) {
        const { error } = await supabase
          .from('presidents')
          .update(dataToSave)
          .eq('id', president.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('presidents')
          .insert([dataToSave])
        if (error) throw error
      }

      router.push('/admin/presidents')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!president?.id) return
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le président ${president.full_name} (${president.term}) ?`)) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('presidents')
        .delete()
        .eq('id', president.id)

      if (error) throw error

      router.push('/admin/presidents')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* 1. INFORMATIONS DU PRÉSIDENT & MANDAT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">1. Identité & Mandat Rotarien</h2>
              <p className="text-xs text-gray-500">Nom, années d&apos;exercice et thème rotarien du mandat</p>
            </div>
          </div>

          {/* Badge Mandat en cours vs Past-Président */}
          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
            formData.is_current 
              ? 'bg-[#E11A60] text-white shadow-xs' 
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            {formData.is_current ? '⭐ Mandat Actuel' : '🏅 Past-Président'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LIAISON OPTIONNELLE AVEC UN MEMBRE DU CLUB */}
          <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/90 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                  <Users size={16} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950">
                    Lier à un Membre du Club (Optionnel)
                  </label>
                  <p className="text-[11px] text-amber-900/80">
                    Permet de synchroniser les informations et d&apos;afficher le badge présidentiel sur sa fiche membre.
                  </p>
                </div>
              </div>

              {formData.member_id && (
                <button
                  type="button"
                  onClick={handleSyncWithMember}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
                  title="Mettre à jour les champs depuis sa fiche membre"
                >
                  <RefreshCw size={13} />
                  <span>Synchroniser les infos</span>
                </button>
              )}
            </div>

            <select
              value={formData.member_id || ''}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white font-semibold text-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            >
              <option value="">— Aucun (Past-Président qui n&apos;est plus membre ou mandat d&apos;époque) —</option>
              {membersList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} {m.role_title ? `• ${m.role_title}` : ''}
                </option>
              ))}
            </select>

            {formData.member_id ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span>
                  Ce mandat est rattaché à sa fiche membre. Un badge d&apos;honneur apparaîtra sur son profil public !
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 italic">
                ℹ️ Mode autonome : si cette personne n&apos;est plus membre du club, laissez sur « Aucun ». Le mandat apparaîtra tout de même dans la galerie des Past-Présidents.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom complet du Président *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: Nelly KOUAKANOU ou Nel KOUNOUEWA"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Mandat / Années d&apos;exercice *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-bold text-[#014F43] focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: Mandat 2025-2026 ou 2024-2025"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Thème Rotarien du Mandat (Optionnel)
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.theme || ''}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: La Magie du Rotary, Créons de l'Espoir dans le Monde..."
              />
            </div>
          </div>

          <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Définir comme Président du mandat en cours ?
              </p>
              <p className="text-xs text-gray-500">
                Si activé, son mot s&apos;affichera sur la page d&apos;accueil du site. Les autres seront automatiquement classés en Past-Présidents.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E11A60]"></div>
            </label>
          </div>

          {/* Photo officielle */}
          <div className="md:col-span-2">
            <ImageUploader
              value={formData.photo_url || null}
              onChange={(url) => setFormData({ ...formData, photo_url: url || '' })}
              entityType="presidents"
              entityId={president?.id}
              label="Photo officielle du Président (Haute Qualité)"
            />
          </div>
        </div>
      </div>

      {/* 2. PROFIL PROFESSIONNEL (Comme un membre) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <div className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-xl">
            <Briefcase size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">2. Profil Professionnel &amp; Carrière</h2>
            <p className="text-xs text-gray-500">Profession, classification et entreprise du président</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Profession / Titre professionnel
            </label>
            <input
              type="text"
              value={formData.professional_title || ''}
              onChange={(e) => setFormData({ ...formData, professional_title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: Juriste d'Affaires, Ingénieur Télécom, Médecin..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Entreprise / Organisation / Cabinet
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: Cabinet Alpha, Banque Centrale, Société Générale..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Devise ou Citation fétiche du Président (Optionnel)
            </label>
            <div className="relative">
              <Quote className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.citation || ''}
                onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm italic focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: « Servir d'abord, pour inspirer les générations futures »"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MESSAGE & BILAN DU MANDAT */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <div className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-xl">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">3. Discours, Bilan &amp; Réalisations</h2>
            <p className="text-xs text-gray-500">Le mot officiel du président et les temps forts de son mandat</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Mot / Discours officiel du Président *
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent leading-relaxed"
              placeholder="Écrivez le message officiel ou le discours marquant du mandat..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Bilan &amp; Réalisations phares du mandat (Optionnel)
            </label>
            <textarea
              rows={4}
              value={formData.achievements || ''}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent leading-relaxed"
              placeholder="Ex: - Construction de 2 forages d'eau potable&#10;- Dépistage gratuit de 1500 personnes&#10;- Jumelage avec le Rotaract Club de Dakar..."
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Les actions phares et réalisations sous son leadership.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Biographie / Parcours Rotarien (Optionnel)
            </label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent leading-relaxed"
              placeholder="Quelques lignes sur son engagement associatif et rotarien..."
            />
          </div>
        </div>
      </div>

      {/* 4. COORDONNÉES & RÉSEAUX SOCIAUX (Comme un membre) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <div className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-xl">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">4. Coordonnées &amp; Réseaux Sociaux</h2>
            <p className="text-xs text-gray-500">Pour permettre aux membres et partenaires d&apos;échanger avec lui</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="president@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Numéro Téléphone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="+229 XX XX XX XX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Lien Profil LinkedIn
            </label>
            <div className="relative">
              <LinkedinIcon className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="https://linkedin.com/in/nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Lien Profil Facebook
            </label>
            <div className="relative">
              <FacebookIcon className="w-4 h-4 text-blue-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="https://facebook.com/nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Lien Profil Instagram
            </label>
            <div className="relative">
              <InstagramIcon className="w-4 h-4 text-pink-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="https://instagram.com/nom"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOUTONS D'ACTION */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-8 py-3.5 bg-[#014F43] hover:bg-[#00362d] text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-center cursor-pointer"
        >
          {loading ? 'Enregistrement en cours...' : president ? 'Mettre à jour le Président' : 'Enregistrer le Président'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors text-center cursor-pointer"
        >
          Annuler
        </button>

        {president?.id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        )}
      </div>
    </form>
  )
}
