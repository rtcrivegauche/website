'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import ImageViewerModal from '@/components/ui/ImageViewerModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface GalleryItem {
  id: string
  title: string
  description?: string
  media_url: string
  category?: string
  created_at?: string
}

export default function GalleryListClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter()
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const imageUrls = items.map(item => item.media_url)

  const handleOpenViewer = (index: number) => {
    setActiveImageIndex(index)
    setViewerOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image de la galerie ?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
      router.refresh()
    } catch (e: any) {
      alert('Erreur lors de la suppression: ' + e.message)
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Aucune image dans la galerie</p>
        <Link
          href="/admin/galerie/nouveau"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter votre première image
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
            <div 
              className="relative h-52 bg-gray-100 cursor-pointer overflow-hidden group/img"
              onClick={() => handleOpenViewer(index)}
            >
              {item.media_url ? (
                <Image
                  src={item.media_url}
                  alt={item.title || 'Image de la galerie'}
                  fill
                  className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Aucun média</div>
              )}
              
              {/* Overlay au survol avec icône d'œil pour visualiser */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm">
                <Eye size={20} />
                <span>Visualiser</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {item.title || 'Sans titre'}
              </h3>
              {item.category && (
                <span className="inline-block px-2.5 py-0.5 bg-[#014F43]/10 text-[#014F43] text-xs font-semibold rounded-full mb-2">
                  {item.category}
                </span>
              )}
              {item.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {item.description}
                </p>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Link
                  href={`/admin/galerie/${item.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit size={14} />
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visionneuse d'images */}
      <ImageViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        src={imageUrls[activeImageIndex] || ''}
        alt={items[activeImageIndex]?.title || 'Galerie'}
        images={imageUrls}
        currentIndex={activeImageIndex}
        onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
      />
    </>
  )
}
