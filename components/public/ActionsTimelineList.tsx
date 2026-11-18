'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, CheckCircle2, HeartHandshake, ArrowRight, Calendar } from 'lucide-react'

interface ActionItem {
  id: string
  title: string
  slug: string
  description?: string | null
  featured_image_url?: string | null
  category: string
  start_date?: string | null
  end_date?: string | null
  location?: string | null
  beneficiaries_count?: number | string | null
  gallery_images?: string[] | null
  status?: string | null
  is_published?: boolean
  is_featured?: boolean
}

interface ActionsTimelineListProps {
  actions: ActionItem[]
}

/**
 * Détermine de façon robuste si une action est passée / réalisée.
 * Priorités :
 * 1. Statut manuel 'termine' -> Passée / Réalisée
 * 2. Statut manuel 'en_cours' -> En cours
 * 3. Date de fin : si renseignée et dans le passé -> Passée / Réalisée
 * 4. Date de début : si renseignée (sans date de fin) et dans le passé -> Passée / Réalisée
 * 5. Sinon -> En cours
 */
function isActionPast(action: ActionItem, today: Date): boolean {
  if (action.status === 'termine') return true
  if (action.status === 'en_cours') return false

  // Date de référence : end_date prioritaire, sinon start_date
  const dateStr = action.end_date || action.start_date
  if (!dateStr) return false

  // Parser la date proprement en fin de journée (23h59)
  const parts = dateStr.split('T')[0].split('-')
  if (parts.length === 3) {
    const actDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59)
    return actDate < today
  }

  const d = new Date(dateStr)
  d.setHours(23, 59, 59, 999)
  return !isNaN(d.getTime()) && d < today
}

export default function ActionsTimelineList({ actions }: ActionsTimelineListProps) {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'completed'>('all')

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const { ongoingActions, completedActions } = useMemo(() => {
    const ongoing: ActionItem[] = []
    const completed: ActionItem[] = []

    actions.forEach((act) => {
      if (isActionPast(act, today)) {
        completed.push(act)
      } else {
        ongoing.push(act)
      }
    })

    return { ongoingActions: ongoing, completedActions: completed }
  }, [actions, today])

  const displayedActions = useMemo(() => {
    if (filter === 'ongoing') return ongoingActions
    if (filter === 'completed') return completedActions
    return actions
  }, [filter, actions, ongoingActions, completedActions])

  return (
    <div>
      {/* Onglets En cours / Réalisées */}
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
          Toutes les actions ({actions.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('ongoing')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'ongoing'
              ? 'bg-[#22C83A] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles size={15} />
          <span>Actions en cours & Projets actifs ({ongoingActions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#014F43] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <CheckCircle2 size={15} />
          <span>Actions réalisées & Bilans ({completedActions.length})</span>
        </button>
      </div>

      {/* Message vide */}
      {displayedActions.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-xl mx-auto px-6">
          <HeartHandshake className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {filter === 'ongoing'
              ? 'Aucune action en cours pour le moment'
              : 'Aucune action terminée répertoriée'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Consultez nos autres initiatives solidaires et communautaires.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-bold text-[#014F43] hover:underline"
          >
            Afficher toutes les actions →
          </button>
        </div>
      ) : (
        /* Grille des actions */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedActions.map((action) => {
            const isCompleted = isActionPast(action, today)
            const hasGallery = Array.isArray(action.gallery_images) && action.gallery_images.length > 0

            return (
              <Link
                key={action.id}
                href={`/actions/${action.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-gray-100/50"
              >
                <div>
                  {action.featured_image_url && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={action.featured_image_url}
                        alt={action.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Catégorie & Badge État */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="bg-[#22C83A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {action.category}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1 ${
                            isCompleted ? 'bg-[#014F43]' : 'bg-[#E11A60]'
                          }`}
                        >
                          {isCompleted ? 'Réalisée' : 'En cours'}
                        </span>
                      </div>

                      {hasGallery && (
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          📷 {action.gallery_images?.length} photo{(action.gallery_images?.length || 0) > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Date si disponible */}
                    {(action.start_date || action.end_date) && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-2">
                        <Calendar size={13} className="text-[#014F43]" />
                        <span>
                          {action.start_date && new Date(action.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                          {action.end_date && action.end_date !== action.start_date && (
                            <> - {new Date(action.end_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</>
                          )}
                        </span>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-[#014F43] mb-3 group-hover:text-[#22C83A] transition-colors line-clamp-2">
                      {action.title}
                    </h3>

                    {action.description && (
                      <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed text-sm">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-[#014F43] font-semibold text-sm group-hover:text-[#22C83A] transition-colors">
                  <span>{isCompleted ? 'Voir le bilan & photos' : 'En savoir plus & impact'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
