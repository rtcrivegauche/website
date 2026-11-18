'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Users, Award, Crown, Sparkles, Star } from 'lucide-react'
import PaginationControls from '@/components/public/PaginationControls'

export interface MemberItem {
  id: string
  full_name: string
  slug: string
  photo_url?: string | null
  role_title?: string | null
  professional_title?: string | null
  company?: string | null
  commission?: string | null
  is_honorary?: boolean | null
  honorary_title?: string | null
  is_active?: boolean
  display_order?: number
}

interface MembersDirectoryProps {
  members: MemberItem[]
  commissions: string[]
}

const ITEMS_PER_PAGE = 12

export default function MembersDirectory({ members, commissions }: MembersDirectoryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'honorary'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCommission, setSelectedCommission] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Réinitialiser la page à 1 lors de tout changement de filtre ou recherche
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, selectedCommission])

  // Comptages
  const honoraryCount = useMemo(() => members.filter((m) => m.is_honorary).length, [members])
  const activeCount = useMemo(() => members.filter((m) => !m.is_honorary).length, [members])

  // Filtrage combiné : Onglet + Recherche texte + Commission
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // 1. Filtre par onglet
      if (activeTab === 'honorary' && !member.is_honorary) return false
      if (activeTab === 'active' && member.is_honorary) return false

      // 2. Filtre par commission
      if (selectedCommission && member.commission !== selectedCommission) {
        return false
      }

      // 3. Recherche texte
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim()
        const matchName = member.full_name?.toLowerCase().includes(query)
        const matchRole = member.role_title?.toLowerCase().includes(query)
        const matchProfession = member.professional_title?.toLowerCase().includes(query)
        const matchCompany = member.company?.toLowerCase().includes(query)
        const matchHonorary = member.honorary_title?.toLowerCase().includes(query)
        const matchCommission = member.commission?.toLowerCase().includes(query)

        if (!matchName && !matchRole && !matchProfession && !matchCompany && !matchHonorary && !matchCommission) {
          return false
        }
      }

      return true
    })
  }, [members, activeTab, selectedCommission, searchQuery])

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMembers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredMembers, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  return (
    <div className="space-y-10">
      {/* 1. Onglets de sélection */}
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
          Tous les membres ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
            activeTab === 'active'
              ? 'bg-[#22C83A] text-white shadow-md scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Users size={16} />
          <span>Membres du Club ({activeCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('honorary')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs ${
            activeTab === 'honorary'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-lg ring-2 ring-amber-300 scale-105'
              : 'bg-amber-50/80 text-amber-900 hover:bg-amber-100 border-2 border-amber-300'
          }`}
        >
          <Crown size={17} className="text-yellow-300" />
          <span>Membres d&apos;Honneur 👑 ({honoraryCount})</span>
        </button>
      </div>

      {/* 2. Barre de recherche et Filtre par Commission */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Rechercher par nom, rôle ou profession
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: Président, Trésorier, Juriste, Médecin, Parrain..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Filtrer par Commission
            </label>
            <select
              value={selectedCommission}
              onChange={(e) => setSelectedCommission(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm bg-white"
            >
              <option value="">Toutes les commissions</option>
              {commissions.map((comm) => (
                <option key={comm} value={comm}>
                  {comm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Grille des membres */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-lg mx-auto p-8">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Aucun membre ne correspond à votre recherche</h3>
          <p className="text-sm text-gray-500 mb-4">
            Essayez de modifier votre mot-clé ou réinitialisez les filtres sélectionnés.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCommission('')
              setActiveTab('all')
            }}
            className="px-4 py-2 bg-[#014F43] text-white rounded-xl text-xs font-bold hover:bg-[#00362d] transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {paginatedMembers.map((member) => {
              const isHonorary = Boolean(member.is_honorary)

              // CARTE MEMBRE D'HONNEUR (Gold VIP)
              if (isHonorary) {
                return (
                  <Link
                    key={member.id}
                    href={`/membres/${member.slug}`}
                    className="group relative rounded-3xl overflow-hidden transition-all duration-300 ring-2 ring-amber-400 border border-amber-300 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30 shadow-md shadow-amber-100/60 hover:shadow-2xl hover:shadow-amber-200/60 hover:-translate-y-1.5 flex flex-col justify-between"
                  >
                    {/* Filigrane d'or subtil en arrière-plan */}
                    <div className="absolute top-2 right-2 text-amber-200/40 pointer-events-none group-hover:scale-125 transition-transform duration-500">
                      <Crown size={80} />
                    </div>

                    <div>
                      {/* Photo avec badge doré */}
                      <div className="relative h-64 bg-amber-100/40 overflow-hidden">
                        {member.photo_url ? (
                          <Image
                            src={member.photo_url}
                            alt={member.full_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 font-black text-4xl">
                            {member.full_name.charAt(0)}
                          </div>
                        )}

                        {/* Ruban / Badge VIP Gold */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg border border-amber-200">
                            <Crown size={13} className="text-yellow-200 fill-yellow-200" />
                            Membre d&apos;Honneur
                          </span>
                        </div>
                      </div>

                      {/* Contenu de la carte VIP */}
                      <div className="p-5 relative z-10">
                        <h3 className="text-xl font-black text-[#014F43] group-hover:text-amber-900 transition-colors mb-1">
                          {member.full_name}
                        </h3>

                        {/* Distinction d'honneur */}
                        {member.honorary_title ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 mb-2">
                            <Sparkles size={13} className="text-amber-600" />
                            <span>{member.honorary_title}</span>
                          </div>
                        ) : member.role_title ? (
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                            {member.role_title}
                          </p>
                        ) : null}

                        {member.professional_title && (
                          <p className="text-sm text-gray-700 font-medium line-clamp-2">
                            {member.professional_title}
                            {member.company && <span className="text-gray-500"> • {member.company}</span>}
                          </p>
                        )}

                        {member.commission && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mt-3 pt-3 border-t border-amber-100">
                            <Award size={14} className="text-amber-600" />
                            <span>{member.commission}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bouton profil VIP */}
                    <div className="px-5 pb-5 pt-1 relative z-10">
                      <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs text-center shadow-xs group-hover:from-amber-600 group-hover:to-amber-700 transition-colors">
                        Découvrir le parcours d&apos;honneur →
                      </div>
                    </div>
                  </Link>
                )
              }

              // CARTE MEMBRE CLASSIQUE
              return (
                <Link
                  key={member.id}
                  href={`/membres/${member.slug}`}
                  className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      {member.photo_url ? (
                        <Image
                          src={member.photo_url}
                          alt={member.full_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-3xl">
                          {member.full_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors mb-1">
                        {member.full_name}
                      </h3>

                      {member.role_title && (
                        <p className="text-xs font-extrabold text-[#E11A60] uppercase tracking-wider mb-1.5">
                          {member.role_title}
                        </p>
                      )}

                      {member.professional_title && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {member.professional_title}
                          {member.company && ` chez ${member.company}`}
                        </p>
                      )}

                      {member.commission && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 font-medium">
                          <Award size={14} className="text-[#014F43]" />
                          <span>{member.commission}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0 text-xs font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors flex items-center gap-1">
                    <span>Voir le profil complet →</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMembers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="membres"
          />
        </>
      )}
    </div>
  )
}
