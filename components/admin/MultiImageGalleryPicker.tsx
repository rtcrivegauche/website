'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import MediaPickerDialog from '@/components/admin/MediaPickerDialog'

interface MultiImageGalleryPickerProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
  description?: string
}

export default function MultiImageGalleryPicker({
  images = [],
  onChange,
  label = 'Galerie photos & Souvenirs de l\'activité',
  description = 'Ajoutez plusieurs photos pour permettre aux visiteurs de revivre l\'événement sous forme d\'album photo.'
}: MultiImageGalleryPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleAddImage = (url: string) => {
    if (!images.includes(url)) {
      onChange([...images, url])
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove))
  }

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp
    onChange(newImages)
  }

  return (
    <div className="space-y-3 pt-2">
      <div>
        <label className="block text-sm font-bold text-gray-800">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>

      {/* Grille des photos déjà ajoutées */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((url, index) => (
          <div
            key={url + index}
            className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-xs hover:shadow-md transition-all"
          >
            <Image
              src={url}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badge de position */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
              #{index + 1}
            </div>

            {/* Bouton supprimer */}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
              title="Supprimer cette photo"
            >
              <X size={13} />
            </button>

            {/* Barre de réordonnancement au bas */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs rounded-xl p-1 text-white">
              <button
                type="button"
                onClick={() => handleMoveImage(index, 'left')}
                disabled={index === 0}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                title="Déplacer vers la gauche"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] font-semibold text-gray-200">Ordre</span>
              <button
                type="button"
                onClick={() => handleMoveImage(index, 'right')}
                disabled={index === images.length - 1}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                title="Déplacer vers la droite"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Bouton Ajouter */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#014F43] bg-gray-50 hover:bg-[#014F43]/5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#014F43] transition-all group"
        >
          <div className="p-3 bg-white rounded-xl shadow-xs group-hover:scale-110 transition-transform">
            <Plus size={22} className="text-[#014F43]" />
          </div>
          <span className="text-xs font-bold text-center px-2">Ajouter des photos</span>
        </button>
      </div>

      {images.length > 0 && (
        <p className="text-[11px] text-gray-400">
          💡 {images.length} photo(s) dans la galerie. Les visiteurs pourront les ouvrir en plein écran avec zoom et défilement.
        </p>
      )}

      {/* Dialogue de sélection média */}
      <MediaPickerDialog
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectImage={handleAddImage}
      />
    </div>
  )
}
