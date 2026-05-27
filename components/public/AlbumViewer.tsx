'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Share2, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'

const FacebookIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

interface Photo {
  id: string
  title: string | null
  media_url: string
  created_at: string
}

interface AlbumViewerProps {
  photos: Photo[]
  title: string
}

export default function AlbumViewer({ photos, title }: AlbumViewerProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const [shareOpenIndex, setShareOpenIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setActivePhotoIndex(null)
    document.body.style.overflow = 'auto'
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (activePhotoIndex === null) return
    let newIndex = direction === 'prev' ? activePhotoIndex - 1 : activePhotoIndex + 1
    
    if (newIndex < 0) {
      newIndex = photos.length - 1
    } else if (newIndex >= photos.length) {
      newIndex = 0
    }
    
    setActivePhotoIndex(newIndex)
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename || 'rotaract-photo.webp'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
      // Fallback simple si CORS bloque
      window.open(url, '_blank')
    }
  }

  const activePhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null

  return (
    <div className="space-y-8">
      {/* Grille responsive des photos de l'album */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {photos.map((photo, index) => (
          <div 
            key={photo.id}
            className="group relative bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-64 md:h-72 cursor-zoom-in"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.media_url}
              alt={photo.title || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay d'actions rapides au survol */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all duration-300">
              <div className="flex justify-between items-center text-white" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => downloadImage(photo.media_url, `rotaract-${photo.id}.webp`)}
                  className="p-2 bg-white/20 hover:bg-[#E11A60] rounded-full backdrop-blur-sm transition-all duration-200"
                  title="Télécharger"
                >
                  <Download size={16} />
                </button>
                
                {/* Partage */}
                <div className="relative">
                  <button
                    onClick={() => setShareOpenIndex(shareOpenIndex === index ? null : index)}
                    className="p-2 bg-white/20 hover:bg-[#014F43] rounded-full backdrop-blur-sm transition-all duration-200"
                    title="Partager"
                  >
                    <Share2 size={16} />
                  </button>
                  
                  {shareOpenIndex === index && (
                    <div className="absolute bottom-12 right-0 bg-gray-900 border border-gray-800 p-2 rounded-2xl shadow-xl flex gap-2 z-20">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Regardez cette photo de l\'album "' + title + '" du Rotaract Cica : ' + photo.media_url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                        title="Partager sur WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(photo.media_url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                        title="Partager sur Facebook"
                      >
                        <FacebookIcon size={16} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Plein Écran */}
      {activePhotoIndex !== null && activePhoto && (
        <div className="fixed inset-0 w-full h-full bg-black/95 z-[100] flex flex-col justify-between p-6">
          {/* Header Lightbox */}
          <div className="flex justify-between items-center text-white z-10">
            <span className="text-sm font-semibold tracking-wider bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              {activePhotoIndex + 1} / {photos.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => downloadImage(activePhoto.media_url, `rotaract-${activePhoto.id}.webp`)}
                className="p-2.5 bg-white/10 hover:bg-[#E11A60] rounded-full backdrop-blur-md transition-all text-white"
                title="Télécharger"
              >
                <Download size={20} />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white"
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image & Contrôles Navigation */}
          <div className="relative flex-grow flex items-center justify-center my-6">
            {/* Flèche Gauche */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-0 md:left-4 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all"
              title="Précédente"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image principale */}
            <div className="relative w-full max-w-5xl h-[70vh]">
              <Image
                src={activePhoto.media_url}
                alt={activePhoto.title || title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Flèche Droite */}
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-0 md:right-4 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all"
              title="Suivante"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Footer Lightbox avec options de partage */}
          <div className="flex flex-col items-center gap-3 text-white z-10 pb-4">
            <h4 className="text-lg font-bold tracking-tight text-center truncate max-w-xl">
              {activePhoto.title || title}
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">Partager la photo :</span>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Découvrez cette photo de l\'album "' + title + '" du Rotaract Cica : ' + activePhoto.media_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-600 hover:bg-green-750 rounded-full text-white transition-all flex items-center gap-1.5 px-4 text-xs font-semibold"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activePhoto.media_url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 hover:bg-blue-755 rounded-full text-white transition-all flex items-center gap-1.5 px-4 text-xs font-semibold"
              >
                <FacebookIcon size={14} /> Facebook
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
