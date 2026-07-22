'use client'

import React, { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
  images?: string[]
  currentIndex?: number
  onNavigate?: (newIndex: number) => void
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  src,
  alt = 'Visualisation image',
  images = [],
  currentIndex = 0,
  onNavigate
}: ImageViewerModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && images.length > 1 && onNavigate && currentIndex > 0) {
        onNavigate(currentIndex - 1)
      }
      if (e.key === 'ArrowRight' && images.length > 1 && onNavigate && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, images, currentIndex, onNavigate])

  useEffect(() => {
    setScale(1)
    setRotation(0)
  }, [src, currentIndex])

  if (!isOpen || !src) return null

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = src.split('/').pop() || 'image'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200" onClick={onClose}>
      {/* Barre d'outils supérieure */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-50 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full border border-white/10">
          {alt || 'Visualisation'} {images.length > 1 ? `(${currentIndex + 1} / ${images.length})` : ''}
        </div>

        <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-full border border-white/10">
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Zoom avant"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Zoom arrière"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Réinitialiser"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Télécharger"
          >
            <Download size={18} />
          </button>
          <div className="w-px h-5 bg-white/20 my-auto" />
          <button
            onClick={onClose}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-full transition"
            title="Fermer (Échap)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Précédent */}
      {images.length > 1 && onNavigate && currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex - 1)
          }}
          className="absolute left-4 z-50 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full border border-white/10 transition"
          title="Image précédente"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Zone de l'image */}
      <div 
        className="relative max-w-full max-h-full p-8 flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
        />
      </div>

      {/* Navigation Suivant */}
      {images.length > 1 && onNavigate && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex + 1)
          }}
          className="absolute right-4 z-50 p-3 text-white bg-black/50 hover:bg-black/80 rounded-full border border-white/10 transition"
          title="Image suivante"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  )
}
