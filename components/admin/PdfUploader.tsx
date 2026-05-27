"use client"

import { useState, useRef } from 'react'
import { Upload, X, FileText, Loader2 } from 'lucide-react'

interface PdfUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  entityId?: string | null
  label?: string
  error?: string
}

export default function PdfUploader({
  value,
  onChange,
  entityId = null,
  label = 'Document PDF Officiel',
  error
}: PdfUploaderProps) {
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
    formData.append('entityType', 'reports')
    if (entityId) {
      formData.append('entityId', entityId)
    }

    try {
      const response = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors du téléversement.")
      }

      if (data.pdf_url) {
        onChange(data.pdf_url)
      }
    } catch (err: any) {
      console.error("Erreur d'upload PDF:", err)
      alert(err.message || "Erreur d'upload du fichier PDF.")
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

  // Extraire le nom de fichier de l'URL pour un affichage propre
  const getFileNameFromUrl = (url: string) => {
    try {
      const decoded = decodeURIComponent(url)
      const parts = decoded.split('/')
      return parts[parts.length - 1]
    } catch (e) {
      return 'document.pdf'
    }
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
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] bg-gray-550/50 hover:bg-gray-50/100 
          ${dragActive ? 'border-[#014F43] bg-[#014F43]/5' : error ? 'border-red-400 bg-red-50/10' : 'border-gray-300 hover:border-[#014F43]'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />

        {value ? (
          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-lg">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex-shrink-0">
              <FileText size={28} />
            </div>
            <div className="flex-grow text-left overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {getFileNameFromUrl(value)}
              </p>
              <a 
                href={value} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[#014F43] hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Visualiser le document
              </a>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Supprimer le fichier"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-[#014F43] animate-spin" />
                <span className="text-sm text-gray-500 font-medium">Téléversement du fichier PDF officiel en cours...</span>
              </div>
            ) : (
              <>
                <div className="p-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-500">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-700">
                    <span className="text-[#014F43] hover:underline">Cliquez pour téléverser le PDF</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-400">Format PDF uniquement (jusqu'à 20 Mo)</p>
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
