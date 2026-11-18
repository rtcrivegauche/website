'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Images, ZoomIn, Eye } from 'lucide-react'
import ImageViewerModal from '@/components/ui/ImageViewerModal'

interface ItemGalleryViewerProps {
  images?: string[] | null
  title?: string
  subtitle?: string
}

export default function ItemGalleryViewer({
  images = [],
  title = 'Galerie Photos & Souvenirs',
  subtitle = 'Revivez les moments forts et les temps d\'échanges à travers cet album photo.'
}: ItemGalleryViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const validImages = (images || []).filter((img): img is string => typeof img === 'string' && img.trim().length > 0)

  if (validImages.length === 0) {
    return null
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-xl">
              <Images size={20} />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#014F43] tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <span className="self-start sm:self-auto px-3.5 py-1.5 bg-[#014F43] text-white text-xs font-bold rounded-full shadow-xs">
          {validImages.length} photo{validImages.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Grille de photos moderne et responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {validImages.map((imageUrl, index) => (
          <button
            key={imageUrl + index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#014F43] transition-all cursor-pointer"
          >
            <Image
              src={imageUrl}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Voile sombre avec icône zoom au survol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
              <span className="p-2 bg-white/20 backdrop-blur-xs rounded-full">
                <ZoomIn size={18} />
              </span>
              <span className="text-xs font-bold hidden sm:inline">Agrandir</span>
            </div>

            {/* Numérotation discrète */}
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
              {index + 1} / {validImages.length}
            </div>
          </button>
        ))}
      </div>

      {/* Visionneuse plein écran interactive */}
      {selectedIndex !== null && (
        <ImageViewerModal
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          src={validImages[selectedIndex]}
          alt={`Photo ${selectedIndex + 1}`}
          images={validImages}
          currentIndex={selectedIndex}
          onNavigate={(newIndex) => setSelectedIndex(newIndex)}
        />
      )}
    </section>
  )
}
