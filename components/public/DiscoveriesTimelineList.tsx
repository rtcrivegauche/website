'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Compass, ArrowRight, Sparkles, History } from 'lucide-react'
import PaginationControls from '@/components/public/PaginationControls'

interface DiscoveryItem {
  id: string
  title: string
  slug: string
  description?: string | null
  featured_image_url?: string | null
  discovery_date?: string | null
  discovery_time?: string | null
  location?: string | null
  location_address?: string | null
  activity_type?: string | null
  organizer_name?: string | null
  participants_count?: number | null
  fee?: string | null
  gallery_images?: string[] | null
  is_published?: boolean
  is_featured?: boolean
}

interface DiscoveriesTimelineListProps {
  discoveries: DiscoveryItem[]
}

const ITEMS_PER_PAGE = 6

export default function DiscoveriesTimelineList({ discoveries }: DiscoveriesTimelineListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Réinitialiser la page à 1 lors du changement de filtre
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const { upcomingDiscoveries, pastDiscoveries } = useMemo(() => {
    const upcoming: DiscoveryItem[] = []
    const past: DiscoveryItem[] = []

    discoveries.forEach((d) => {
      if (!d.discovery_date) {
        past.push(d)
        return
      }
      const date = new Date(d.discovery_date)
      if (date >= today) {
        upcoming.push(d)
      } else {
        past.push(d)
      }
    })

    return { upcomingDiscoveries: upcoming, pastDiscoveries: past }
  }, [discoveries, today])

  const displayedDiscoveries = useMemo(() => {
    if (filter === 'upcoming') return upcomingDiscoveries
    if (filter === 'past') return pastDiscoveries
    return discoveries
  }, [filter, discoveries, upcomingDiscoveries, pastDiscoveries])

  const totalPages = Math.ceil(displayedDiscoveries.length / ITEMS_PER_PAGE)
  const paginatedDiscoveries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return displayedDiscoveries.slice(start, start + ITEMS_PER_PAGE)
  }, [displayedDiscoveries, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Filtres À venir / Passés */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#014F43] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Toutes les découvertes ({discoveries.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('upcoming')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'upcoming'
              ? 'bg-[#22C83A] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles size={15} />
          <span>Prochaines immersions ({upcomingDiscoveries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('past')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'past'
              ? 'bg-[#E11A60] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <History size={15} />
          <span>Souvenirs & Passées ({pastDiscoveries.length})</span>
        </button>
      </div>

      {/* Message vide */}
      {displayedDiscoveries.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-xl mx-auto px-6">
          <Compass className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {filter === 'upcoming'
              ? 'Aucune immersion programmée dans l\'immédiat'
              : 'Aucune sortie passée répertoriée'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter === 'upcoming'
              ? 'Le club prépare de nouvelles explorations enrichissantes. Revenez régulièrement !'
              : 'Explorez l\'ensemble des fiches découvertes.'}
          </p>
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-bold text-[#014F43] hover:underline"
          >
            Afficher toutes les découvertes →
          </button>
        </div>
      ) : (
        <>
          {/* Grille des découvertes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedDiscoveries.map((item) => {
              const isUpcoming = item.discovery_date ? new Date(item.discovery_date) >= today : false
              const hasGallery = Array.isArray(item.gallery_images) && item.gallery_images.length > 0

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo de couverture */}
                    <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                      {item.featured_image_url ? (
                        <Image
                          src={item.featured_image_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-radial from-[#014F43]/10 to-[#014F43]/30">
                          <Compass className="w-16 h-16 text-[#014F43]/40" />
                        </div>
                      )}

                      {/* Badge Statut */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1 ${
                            isUpcoming ? 'bg-[#22C83A]' : 'bg-[#E11A60]'
                          }`}
                        >
                          {isUpcoming ? (
                            <>
                              <Sparkles size={12} />
                              À venir
                            </>
                          ) : (
                            <>
                              <History size={12} />
                              Passée
                            </>
                          )}
                        </span>

                        {item.activity_type && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white shadow-md">
                            {item.activity_type}
                          </span>
                        )}
                      </div>

                      {hasGallery && (
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          📷 {item.gallery_images?.length} photo{(item.gallery_images?.length || 0) > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Corps de la carte */}
                    <div className="p-6">
                      {/* Date, Heure & Lieu */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 mb-3">
                        {item.discovery_date && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150">
                            <Calendar size={13} className="text-[#014F43]" />
                            <span>
                              {new Date(item.discovery_date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}

                        {item.discovery_time && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150 text-[#014F43]">
                            <span>⏰ {item.discovery_time}</span>
                          </div>
                        )}

                        {item.location && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150">
                            <MapPin size={13} className="text-[#E11A60]" />
                            <span className="truncate max-w-[130px]">{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="text-xl font-bold text-[#014F43] mb-3 group-hover:text-[#E11A60] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Résumé */}
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pied de carte avec lien vers le détail */}
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">
                      {item.fee ? `Tarif : ${item.fee}` : 'Découverte Rotaract'}
                    </span>

                    <Link
                      href={`/decouvertes/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#014F43] group-hover:text-[#E11A60] transition-colors"
                    >
                      <span>{isUpcoming ? 'Détails & Infos' : 'Voir les souvenirs'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayedDiscoveries.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="découvertes"
          />
        </>
      )}
    </div>
  )
}
