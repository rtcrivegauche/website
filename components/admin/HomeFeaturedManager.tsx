'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, GripVertical } from 'lucide-react'

interface ContentItem {
  id: string
  title?: string
  full_name?: string
  event_date?: string
  category?: string
  published_at?: string
}

interface FeaturedItem {
  id: string
  section_key: string
  item_type: string
  item_id: string
  order_index: number
}

interface HomeFeaturedManagerProps {
  events: ContentItem[]
  actions: ContentItem[]
  members: ContentItem[]
  gallery: ContentItem[]
  posts: ContentItem[]
  featured: FeaturedItem[]
}

export default function HomeFeaturedManager({
  events,
  actions,
  members,
  gallery,
  posts,
  featured
}: HomeFeaturedManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Nettoyage automatique en arrière-plan des éléments orphelins (supprimés ou dépubliés)
  useEffect(() => {
    const cleanupOrphans = async () => {
      const orphans = featured.filter(f => {
        let items: ContentItem[] = []
        if (f.item_type === 'event') items = events
        else if (f.item_type === 'action') items = actions
        else if (f.item_type === 'member') items = members
        else if (f.item_type === 'gallery') items = gallery
        else if (f.item_type === 'post') items = posts
        else return true // Type inconnu, considéré orphelin

        // Si l'item n'existe plus dans les items actifs/publiés, il est orphelin
        return !items.some(item => item.id === f.item_id)
      })

      if (orphans.length > 0) {
        console.log(`Nettoyage silencieux de ${orphans.length} élément(s) de page d'accueil orphelin(s) de la BDD...`)
        const supabase = createClient()
        const idsToDelete = orphans.map(o => o.id)
        
        const { error } = await supabase
          .from('home_featured_items')
          .delete()
          .in('id', idsToDelete)

        if (!error) {
          router.refresh()
        }
      }
    }

    cleanupOrphans()
  }, [featured, events, actions, members, gallery, posts, router])

  const sections = [
    {
      key: 'featured_event',
      title: 'Événement mis en avant',
      type: 'event',
      items: events,
      max: 1,
      description: 'Sélectionnez l\'événement à afficher en grand sur la page d\'accueil'
    },
    {
      key: 'featured_actions',
      title: 'Actions prioritaires',
      type: 'action',
      items: actions,
      max: 4,
      description: 'Choisissez jusqu\'à 4 actions à mettre en avant'
    },
    {
      key: 'featured_members',
      title: 'Membres à l\'honneur',
      type: 'member',
      items: members,
      max: 5,
      description: 'Sélectionnez les membres à afficher (le membre central sera le 3ème)'
    },
    {
      key: 'featured_gallery',
      title: 'Galerie',
      type: 'gallery',
      items: gallery,
      max: 6,
      description: 'Choisissez les images pour la section "Vivre le Rotaract Cica"'
    },
    {
      key: 'featured_posts',
      title: 'Actualités',
      type: 'post',
      items: posts,
      max: 4,
      description: 'Sélectionnez les articles à afficher'
    }
  ]

  const getFeaturedForSection = (sectionKey: string) => {
    return featured
      .filter(f => f.section_key === sectionKey)
      .sort((a, b) => a.order_index - b.order_index)
  }

  const handleAddItem = async (sectionKey: string, itemType: string, itemId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const currentFeatured = getFeaturedForSection(sectionKey)
      const nextOrder = currentFeatured.length + 1

      const { error } = await supabase
        .from('home_featured_items')
        .insert({
          section_key: sectionKey,
          item_type: itemType,
          item_id: itemId,
          order_index: nextOrder
        })

      if (error) throw error

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (id: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('home_featured_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Modifications enregistrées avec succès !
        </div>
      )}

      {sections.map(section => {
        const currentFeatured = getFeaturedForSection(section.key).filter(f => 
          section.items.some(item => item.id === f.item_id)
        )
        const selectedIds = currentFeatured.map(f => f.item_id)
        const availableItems = section.items.filter(item => !selectedIds.includes(item.id))

        return (
          <div key={section.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {currentFeatured.length} / {section.max} sélectionné(s)
              </p>
            </div>

            {/* Items sélectionnés */}
            {currentFeatured.length > 0 && (
              <div className="mb-4 space-y-2">
                {currentFeatured.map((item, index) => {
                  const content = section.items.find(i => i.id === item.item_id)
                  if (!content) return null

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <GripVertical size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {index + 1}. {content.title || content.full_name}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={loading}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ajouter un item */}
            {currentFeatured.length < section.max && availableItems.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ajouter un élément
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItem(section.key, section.type, e.target.value)
                      e.target.value = ''
                    }
                  }}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                  aria-label={`Ajouter un élément à ${section.title}`}
                >
                  <option value="">-- Sélectionner --</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title || item.full_name}
                      {item.event_date && ` - ${new Date(item.event_date).toLocaleDateString()}`}
                      {item.category && ` (${item.category})`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentFeatured.length >= section.max && (
              <p className="text-sm text-gray-500 italic">
                Limite atteinte. Supprimez un élément pour en ajouter un autre.
              </p>
            )}

            {availableItems.length === 0 && currentFeatured.length < section.max && (
              <p className="text-sm text-gray-500 italic">
                Aucun contenu disponible. Créez d&apos;abord du contenu dans les modules correspondants.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
