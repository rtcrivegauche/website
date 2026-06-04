"use client"

import { useState, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  entityType: 'members' | 'events' | 'actions' | 'blog' | 'gallery' | 'config' | 'medias' | 'presidents'
  entityId?: string | null
  label?: string
  error?: string
}

export default function ImageUploader({
  value,
  onChange,
  entityType,
  entityId = null,
  label = 'Image',
  error
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entityType', entityType)
    if (entityId) {
      formData.append('entityId', entityId)
    }

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors du téléversement.")
      }

      if (data.image_url) {
        onChange(data.image_url)
      }
    } catch (err: any) {
      console.error("Erreur d'upload:", err)
      alert(err.message || "Erreur d'upload d'image.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onChange(null)
  }

  const triggerInputClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
      
      <div 
        onClick={triggerInputClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] bg-gray-50/50 hover:bg-gray-50/100 
          ${dragActive ? 'border-rose-500 bg-rose-50/30' : error ? 'border-red-400 bg-red-50/10' : 'border-gray-300 hover:border-rose-400'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {value ? (
          <div className="relative group w-full max-w-xs aspect-video md:aspect-[2/1] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={value} 
              alt={label} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform hover:scale-105"
                title="Supprimer l'image"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-rose-500 animate-spin" />
                <span className="text-sm text-gray-500 font-medium">Traitement et optimisation en cours...</span>
              </div>
            ) : (
              <>
                <div className="p-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-500">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-700">
                    <span className="text-rose-600 hover:underline">Cliquez pour téléverser</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-400">JPEG, PNG ou WebP jusqu'à 10 Mo (converti et optimisé en WebP)</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-xs pl-1">{error}</span>}
    </div>
  )
}
