'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Upload, Check, Image as ImageIcon, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MediaPickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (url: string) => void
}

interface MediaItem {
  id: string
  title: string
  url: string
  media_type?: string
}

export default function MediaPickerDialog({ isOpen, onClose, onSelectImage }: MediaPickerDialogProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    async function loadMedia() {
      setLoading(true)
      try {
        const supabase = createClient()
        
        // 1. Charger de media_files
        const { data: mediaData } = await supabase
          .from('media_files')
          .select('*')
          .order('created_at', { ascending: false })

        // 2. Charger de gallery
        const { data: galleryData } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })

        const unifiedList: MediaItem[] = []
        const seenUrls = new Set<string>()

        // Ajouter les images de media_files
        if (mediaData) {
          mediaData.forEach(m => {
            const url = m.public_url || m.url
            if (url && (!m.mime_type || m.mime_type.startsWith('image'))) {
              seenUrls.add(url)
              unifiedList.push({
                id: m.id,
                title: m.original_name || 'Médiathèque',
                url: url,
                media_type: m.mime_type
              })
            }
          })
        }

        // Ajouter les images de gallery
        if (galleryData) {
          galleryData.forEach(g => {
            if (g.media_url && !seenUrls.has(g.media_url)) {
              seenUrls.add(g.media_url)
              unifiedList.push({
                id: g.id,
                title: g.title || 'Galerie',
                url: g.media_url,
                media_type: 'image/jpeg'
              })
            }
          })
        }

        setMediaList(unifiedList)
      } catch (e) {
        console.error('Erreur chargement médiathèque unifiée:', e)
      } finally {
        setLoading(false)
      }
    }
    loadMedia()
  }, [isOpen])

  if (!isOpen) return null

  const filteredMedia = mediaList.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.url?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const file = files[0]

      // 1. Demander une URL présignée au serveur Next.js
      const presignResponse = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'image/jpeg',
          entityType: 'uploads'
        })
      })

      if (!presignResponse.ok) {
        throw new Error('Échec de la génération de signature d\'upload')
      }

      const { uploadUrl, publicUrl, originalName, bucket, finalFormat, entityType, fileKey } = await presignResponse.json()

      // 2. Déposer le fichier directement sur Cloudflare R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file
      })

      if (!uploadResponse.ok) {
        throw new Error('Le téléversement vers le stockage Cloudflare a échoué')
      }

      // 3. Sauvegarder dans la table media_files
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: newMedia } = await supabase.from('media_files').insert([{
        user_id: user?.id || null,
        entity_type: entityType || 'uploads',
        original_name: originalName,
        file_key: fileKey,
        public_url: publicUrl,
        mime_type: file.type || 'image/jpeg',
        final_format: finalFormat || 'webp',
        size_bytes: file.size,
        bucket: bucket || 'rtcrivegaucheclub',
        provider: 'cloudflare_r2'
      }]).select().single()

      if (newMedia) {
        setMediaList(prev => [{
          id: newMedia.id,
          title: newMedia.original_name || file.name,
          url: newMedia.public_url || publicUrl,
          media_type: newMedia.mime_type
        }, ...prev])
      } else {
        setMediaList(prev => [{ id: 'temp_' + Date.now(), title: file.name, url: publicUrl }, ...prev])
      }

      setSelectedUrl(publicUrl)
      setActiveTab('library')
    } catch (err: any) {
      alert('Erreur upload : ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleConfirmSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedUrl) {
      onSelectImage(selectedUrl)
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#014F43]" />
              Sélecteur d'images
            </h2>

            {/* Onglets */}
            <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveTab('library')
                }}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'library' ? 'bg-white text-[#014F43] shadow-sm' : 'text-gray-600'}`}
              >
                Médiathèque
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveTab('upload')
                }}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'upload' ? 'bg-white text-[#014F43] shadow-sm' : 'text-gray-600'}`}
              >
                Uploader une image
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une image..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:outline-none"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-gray-400 font-medium">Chargement de la médiathèque...</div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Aucune image disponible dans la médiathèque.</p>
                  <p className="text-xs mt-1 text-gray-400">Passez sur l'onglet "Uploader une image" pour en ajouter une nouvelle.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-1">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedUrl(item.url)
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition group ${
                          isSelected ? 'border-[#014F43] ring-4 ring-[#014F43]/20 shadow-md' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Image
                          src={item.url}
                          alt={item.title || 'Image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#014F43] text-white p-1 rounded-full shadow">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Onglet Upload */
            <div className="py-12 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-gray-50">
              <Upload size={48} className="text-[#014F43] mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-gray-900 mb-1">Téléverser une nouvelle image dans la médiathèque</h3>
              <p className="text-xs text-gray-500 mb-6">L'image sera automatiquement enregistrée dans votre stockage pour être réutilisée.</p>
              
              <label 
                className="px-6 py-3 bg-[#014F43] hover:bg-[#00362d] text-white rounded-xl text-sm font-bold cursor-pointer transition shadow-md inline-flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{uploading ? 'Téléversement en cours...' : 'Sélectionner un fichier'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Pied de modal */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirmSelection}
            disabled={!selectedUrl}
            className="px-6 py-2.5 bg-[#014F43] text-white rounded-xl text-sm font-bold hover:bg-[#00362d] transition disabled:opacity-50 shadow-md"
          >
            Choisir cette image
          </button>
        </div>
      </div>
    </div>
  )
}
