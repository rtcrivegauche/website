'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Sparkles, History, CheckCircle2 } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  slug: string
  description?: string | null
  event_date: string
  location?: string | null
  location_address?: string | null
  featured_image_url?: string | null
  gallery_images?: string[] | null
  is_published?: boolean
  is_featured?: boolean
}

interface EventsTimelineListProps {
  events: EventItem[]
}

export default function EventsTimelineList({ events }: EventsTimelineListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming: EventItem[] = []
    const past: EventItem[] = []

    events.forEach((ev) => {
      const evDate = new Date(ev.event_date)
      if (evDate >= today) {
        upcoming.push(ev)
      } else {
        past.push(ev)
      }
    })

    return { upcomingEvents: upcoming, pastEvents: past }
  }, [events, today])

  const displayedEvents = useMemo(() => {
    if (filter === 'upcoming') return upcomingEvents
    if (filter === 'past') return pastEvents
    return events
  }, [filter, events, upcomingEvents, pastEvents])

  return (
    <div>
      {/* Onglets de filtrage */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#014F43] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Tous les événements ({events.length})
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
          <span>À venir ({upcomingEvents.length})</span>
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
          <span>Événements passés / Souvenirs ({pastEvents.length})</span>
        </button>
      </div>

      {/* Message si aucun élément dans le filtre sélectionné */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-xl mx-auto px-6">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {filter === 'upcoming'
              ? 'Aucun événement à venir pour le moment'
              : 'Aucun événement passé répertorié'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter === 'upcoming'
              ? 'Revenez très bientôt pour découvrir nos prochaines rencontres associatives !'
              : 'Consultez la liste complète des événements du club.'}
          </p>
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-bold text-[#014F43] hover:underline"
          >
            Afficher tous les événements →
          </button>
        </div>
      ) : (
        /* Grille des événements */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayedEvents.map((event) => {
            const evDate = new Date(event.event_date)
            const isUpcoming = evDate >= today
            const hasGallery = Array.isArray(event.gallery_images) && event.gallery_images.length > 0

            return (
              <Link
                key={event.id}
                href={`/evenements/${event.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100/50"
              >
                {event.featured_image_url && (
                  <div className="relative w-full aspect-square md:aspect-[1920/744] overflow-hidden">
                    <Image
                      src={event.featured_image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-555"
                    />

                    {/* Badge État : À venir ou Passé */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
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
                            Passé
                          </>
                        )}
                      </span>

                      {hasGallery && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white shadow-md">
                          📷 Album photo ({event.gallery_images?.length})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl text-center min-w-[70px] ${isUpcoming ? 'bg-[#014F43]' : 'bg-gray-700'}`}>
                        <span className="block text-2xl font-bold text-white">
                          {evDate.getDate()}
                        </span>
                        <span className="text-[10px] text-white/90 uppercase font-bold tracking-wider">
                          {evDate.toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {evDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}{' '}
                          {event.location && `• ${event.location}`}
                        </p>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="text-xs font-bold text-[#E11A60] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isUpcoming ? 'En savoir plus et s\'inscrire →' : 'Voir le compte-rendu & photos →'}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
