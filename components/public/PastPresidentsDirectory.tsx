'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Award, 
  Search, 
  Star, 
  Sparkles, 
  Briefcase, 
  Quote, 
  Calendar, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Users
} from 'lucide-react'
import PaginationControls from '@/components/public/PaginationControls'

const LinkedinIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const FacebookIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export interface PresidentItem {
  id: string
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
  member?: {
    id: string
    full_name: string
    slug: string
    photo_url: string | null
    role_title: string | null
    is_active?: boolean
  } | null
}

interface PastPresidentsDirectoryProps {
  presidents: PresidentItem[]
}

const ITEMS_PER_PAGE = 6

export default function PastPresidentsDirectory({ presidents }: PastPresidentsDirectoryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'past'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPresident, setSelectedPresident] = useState<PresidentItem | null>(null)

  // Réinitialiser la page à 1 lors du changement d'onglet ou de recherche
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery])

  // Comptages
  const currentCount = useMemo(() => presidents.filter(p => p.is_current).length, [presidents])
  const pastCount = useMemo(() => presidents.filter(p => !p.is_current).length, [presidents])

  // Filtrage combiné : Onglet + Recherche
  const filteredPresidents = useMemo(() => {
    return presidents.filter((p) => {
      // 1. Filtre par onglet
      if (activeTab === 'current' && !p.is_current) return false
      if (activeTab === 'past' && p.is_current) return false

      // 2. Recherche textuelle
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim()
        const matchName = p.full_name?.toLowerCase().includes(query)
        const matchTerm = p.term?.toLowerCase().includes(query)
        const matchTheme = p.theme?.toLowerCase().includes(query)
        const matchProfession = p.professional_title?.toLowerCase().includes(query)
        const matchCompany = p.company?.toLowerCase().includes(query)
        const matchAchievements = p.achievements?.toLowerCase().includes(query)

        if (!matchName && !matchTerm && !matchTheme && !matchProfession && !matchCompany && !matchAchievements) {
          return false
        }
      }

      return true
    })
  }, [presidents, activeTab, searchQuery])

  const totalPages = Math.ceil(filteredPresidents.length / ITEMS_PER_PAGE)
  const paginatedPresidents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPresidents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPresidents, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  return (
    <div className="space-y-10">
      {/* 1. Onglets de filtrage */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
            activeTab === 'all'
              ? 'bg-[#014F43] text-white shadow-md scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Tous les Présidents ({presidents.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
            activeTab === 'current'
              ? 'bg-[#E11A60] text-white shadow-md scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Star size={15} className="fill-current" />
          <span>Mandat Actuel ({currentCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs ${
            activeTab === 'past'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-lg ring-2 ring-amber-300 scale-105'
              : 'bg-amber-50/80 text-amber-900 hover:bg-amber-100 border-2 border-amber-300'
          }`}
        >
          <Award size={16} className="text-yellow-600" />
          <span>Past-Présidents 🏅 ({pastCount})</span>
        </button>
      </div>

      {/* 2. Barre de recherche */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 max-w-3xl mx-auto">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Rechercher par nom, année de mandat, profession ou thème
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ex: Nelly KOUAKANOU, 2025-2026, Avocat, Espoir..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* 3. Grille des Présidents & Past-Présidents */}
      {filteredPresidents.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-lg mx-auto p-8">
          <Award size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Aucun président trouvé</h3>
          <p className="text-sm text-gray-500 mb-4">
            Essayez de modifier votre mot-clé ou réinitialisez les filtres.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
            }}
            className="px-4 py-2 bg-[#014F43] text-white rounded-xl text-xs font-bold hover:bg-[#00362d] transition cursor-pointer"
          >
            Afficher tous les présidents
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPresidents.map((p) => {
              const isCurrent = p.is_current

              return (
                <div
                  key={p.id}
                  className={`group bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative ${
                    isCurrent 
                      ? 'border-[#E11A60] ring-2 ring-[#E11A60]/20 shadow-rose-100' 
                      : 'border-amber-200/80 bg-gradient-to-b from-amber-50/20 via-white to-white'
                  }`}
                >
                  {/* Filigrane discret */}
                  <div className="absolute top-2 right-2 text-amber-200/30 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                    <Award size={72} />
                  </div>

                  <div>
                    {/* Photo de profil */}
                    <div className="relative h-72 w-full bg-gradient-to-br from-[#014F43]/10 to-[#E11A60]/10 overflow-hidden">
                      {p.photo_url ? (
                        <Image
                          src={p.photo_url}
                          alt={p.full_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#014F43] font-black text-6xl">
                          {p.full_name.charAt(0)}
                        </div>
                      )}

                      {/* Badge Mandat en haut à gauche */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full shadow-md text-white ${
                          isCurrent 
                            ? 'bg-[#E11A60]' 
                            : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border border-amber-300'
                        }`}>
                          {isCurrent ? <Star size={12} className="fill-white" /> : <Award size={12} />}
                          <span>{p.term}</span>
                        </span>
                      </div>

                      {/* Badge Statut en haut à droite */}
                      {isCurrent && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-[#014F43] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Présidence en cours
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contenu de la fiche */}
                    <div className="p-6">
                      <h3 className="text-xl font-black text-[#014F43] group-hover:text-[#E11A60] transition-colors mb-1">
                        {p.full_name}
                      </h3>

                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                        {isCurrent ? 'Président du Mandat' : 'Past-Président'}
                      </p>

                      {/* Lien vers sa fiche membre si rattaché */}
                      {p.member?.slug && (
                        <div className="mb-3">
                          <Link
                            href={`/membres/${p.member.slug}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            title="Voir sa fiche membre dans le trombinoscope"
                          >
                            <Users size={12} className="text-emerald-700" />
                            <span>Membre du Club • Fiche profil →</span>
                          </Link>
                        </div>
                      )}

                      {/* Thème du mandat */}
                      {p.theme && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-300 px-2.5 py-1 rounded-lg mb-3">
                          <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
                          <span className="line-clamp-1">Thème : « {p.theme} »</span>
                        </div>
                      )}

                      {/* Profession & Entreprise */}
                      {(p.professional_title || p.company) && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium mb-3">
                          <Briefcase size={13} className="text-[#014F43] flex-shrink-0" />
                          <span className="line-clamp-1">
                            {p.professional_title}
                            {p.company && ` • ${p.company}`}
                          </span>
                        </div>
                      )}

                      {/* Citation ou extrait du mot */}
                      {p.citation ? (
                        <p className="text-xs text-gray-600 italic line-clamp-3 mb-4 pl-3 border-l-2 border-[#E11A60]">
                          « {p.citation} »
                        </p>
                      ) : p.message ? (
                        <p className="text-xs text-gray-500 italic line-clamp-3 mb-4 leading-relaxed">
                          « {p.message} »
                        </p>
                      ) : null}

                      {/* Réalisations succinctes */}
                      {p.achievements && (
                        <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 line-clamp-2 border border-gray-150 mb-2">
                          <strong>Bilan :</strong> {p.achievements}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pied de carte avec bouton d'ouverture du modal */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedPresident(p)}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#014F43] hover:text-[#E11A60] transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <span>Découvrir le mandat</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Réseaux sociaux */}
                    <div className="flex items-center gap-2">
                      {p.linkedin_url && (
                        <a
                          href={p.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#0077b5] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Profil LinkedIn"
                        >
                          <LinkedinIcon size={13} />
                        </a>
                      )}
                      {p.facebook_url && (
                        <a
                          href={p.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#1877f2] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Profil Facebook"
                        >
                          <FacebookIcon size={13} />
                        </a>
                      )}
                      {p.instagram_url && (
                        <a
                          href={p.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-pink-600 text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Profil Instagram"
                        >
                          <InstagramIcon size={13} />
                        </a>
                      )}
                      {p.email && (
                        <a
                          href={`mailto:${p.email}`}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#E11A60] text-gray-600 hover:text-white flex items-center justify-center transition-colors"
                          title="Envoyer un email"
                        >
                          <Mail size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPresidents.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="présidents"
          />
        </>
      )}

      {/* 4. MODAL DÉTAILS DU MANDAT PRÉSIDENTIEL */}
      {selectedPresident && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedPresident(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-150 my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header du modal */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#014F43] via-[#00362d] to-[#012520] text-white">
              <button
                type="button"
                onClick={() => setSelectedPresident(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0 bg-white/10 flex items-center justify-center font-black text-2xl">
                  {selectedPresident.photo_url ? (
                    <Image
                      src={selectedPresident.photo_url}
                      alt={selectedPresident.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    selectedPresident.full_name.charAt(0)
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-black mb-2 shadow-xs">
                    <Award size={13} />
                    <span>{selectedPresident.term}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedPresident.full_name}
                  </h3>

                  {(selectedPresident.professional_title || selectedPresident.company) && (
                    <p className="text-xs text-white/80 mt-1">
                      {selectedPresident.professional_title}
                      {selectedPresident.company && ` • ${selectedPresident.company}`}
                    </p>
                  )}

                  {selectedPresident.member?.slug && (
                    <div className="mt-2.5">
                      <Link
                        href={`/membres/${selectedPresident.member.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#014F43] text-xs font-bold transition duration-200"
                        title="Voir sa fiche membre complète"
                      >
                        <Users size={13} />
                        <span>Consulter son profil membre →</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {selectedPresident.theme && (
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 text-xs font-bold text-amber-200">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Thème de mandat : « {selectedPresident.theme} »</span>
                </div>
              )}
            </div>

            {/* Corps du modal défilable */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              {/* Citation */}
              {selectedPresident.citation && (
                <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-2xl">
                  <p className="text-xs sm:text-sm text-amber-900 font-medium italic">
                    « {selectedPresident.citation} »
                  </p>
                </div>
              )}

              {/* Discours & Mot du président */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#014F43] mb-2 flex items-center gap-1.5">
                  <Quote size={14} className="text-[#E11A60]" />
                  <span>Le Mot du Président</span>
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3 whitespace-pre-line bg-gray-50 p-5 rounded-2xl border border-gray-150">
                  {selectedPresident.message}
                </div>
              </div>

              {/* Bilan & Réalisations */}
              {selectedPresident.achievements && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#014F43] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#22C83A]" />
                    <span>Réalisations &amp; Actions phares du mandat</span>
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
                    {selectedPresident.achievements}
                  </div>
                </div>
              )}

              {/* Biographie */}
              {selectedPresident.bio && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#014F43] mb-2">
                    Parcours &amp; Engagement
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {selectedPresident.bio}
                  </p>
                </div>
              )}

              {/* Liens de contact */}
              <div className="pt-4 border-t border-gray-150 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-400">
                  Rotaract Club de Cotonou Rive Gauche Cica
                </span>

                <div className="flex items-center gap-2">
                  {selectedPresident.email && (
                    <a
                      href={`mailto:${selectedPresident.email}`}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-[#014F43] hover:text-white text-gray-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Mail size={13} />
                      <span>Email</span>
                    </a>
                  )}

                  {selectedPresident.linkedin_url && (
                    <a
                      href={selectedPresident.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <LinkedinIcon size={13} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {selectedPresident.facebook_url && (
                    <a
                      href={selectedPresident.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FacebookIcon size={13} />
                      <span>Facebook</span>
                    </a>
                  )}

                  {selectedPresident.instagram_url && (
                    <a
                      href={selectedPresident.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <InstagramIcon size={13} />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
