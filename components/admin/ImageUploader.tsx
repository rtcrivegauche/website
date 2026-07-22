"use client"

import { useState } from 'react'
import { ImageIcon, X, FolderOpen, RefreshCw } from 'lucide-react'
import MediaPickerDialog from '@/components/admin/MediaPickerDialog'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  entityType?: string
  entityId?: string | null
  label?: string
  error?: string
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  error
}: ImageUploaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleOpenPicker = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPickerOpen(true)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}

      {value ? (
        /* Image sélectionnée */
        <div className="relative group w-full max-w-md aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt={label} 
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          />

          {/* Overlay d'actions au survol */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
            <button
              type="button"
              onClick={handleOpenPicker}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold shadow-lg hover:bg-gray-100 transition"
            >
              <RefreshCw size={14} />
              Changer l'image
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition"
              title="Supprimer l'image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Zone centrale principale pour ouvrir la médiathèque */
        <div
          onClick={handleOpenPicker}
          className="border-2 border-dashed border-gray-300 hover:border-[#014F43] bg-gray-50/70 hover:bg-[#014F43]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[180px] group"
        >
          <div className="p-4 bg-white border border-gray-200 rounded-full shadow-sm text-[#014F43] group-hover:scale-110 transition-transform mb-3">
            <FolderOpen size={28} />
          </div>

          <h4 className="text-sm font-bold text-gray-800 mb-1 group-hover:text-[#014F43] transition-colors">
            Choisir une image
          </h4>
          <p className="text-xs text-gray-500 max-w-xs">
            Cliquez pour sélectionner une image de votre médiathèque ou en téléverser une nouvelle
          </p>
        </div>
      )}

      {error && <span className="text-red-500 text-xs pl-1">{error}</span>}

      {/* Pop-up Sélecteur de Médiathèque */}
      <MediaPickerDialog
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectImage={(url) => onChange(url)}
      />
    </div>
  )
}
