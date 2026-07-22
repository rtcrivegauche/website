'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { 
  Folder, 
  FolderPlus, 
  Upload, 
  FileText, 
  File, 
  Image as ImageIcon, 
  Eye, 
  Trash2, 
  Edit, 
  ChevronRight, 
  Home, 
  ExternalLink,
  Search,
  Grid,
  List,
  FolderInput
} from 'lucide-react'
import ImageViewerModal from '@/components/ui/ImageViewerModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export interface FileItem {
  id: string
  title: string
  url: string
  media_type: string
  file_size?: number
  folder_id?: string | null
  folder_path?: string
  created_at?: string
}

export interface FolderItem {
  id: string
  name: string
  parent_id: string | null
}

interface FileManagerProps {
  initialFiles: FileItem[]
  initialFolders?: FolderItem[]
  isPickerMode?: boolean
  onSelectFile?: (file: FileItem) => void
}

const STORAGE_KEY_FOLDERS = 'rotaract_media_folders_v1'

export default function FileManager({ 
  initialFiles, 
  initialFolders = [], 
  isPickerMode = false,
  onSelectFile 
}: FileManagerProps) {
  const router = useRouter()
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  
  // Vue & Filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Modals & Visionneuse
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  
  // Nouveau dossier
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)

  // Déplacement de fichier
  const [movingFile, setMovingFile] = useState<FileItem | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)

  // Chargement des dossiers persistés
  useEffect(() => {
    try {
      const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS)
      if (savedFolders) {
        const parsed = JSON.parse(savedFolders)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFolders(parsed)
        }
      }
    } catch (e) {
      console.error('Erreur chargement dossiers persistant:', e)
    }
  }, [])

  // Sauvegarde des dossiers lors des modifications
  const saveFolders = (newFolders: FolderItem[]) => {
    setFolders(newFolders)
    try {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(newFolders))
    } catch (e) {
      console.error('Erreur sauvegarde dossiers:', e)
    }
  }

  // Dossiers actuels au niveau courant
  const currentFolders = useMemo(() => {
    return folders.filter(f => f.parent_id === currentFolderId)
  }, [folders, currentFolderId])

  // Fichiers actuels au niveau courant
  const currentFiles = useMemo(() => {
    let filtered = files.filter(f => (f.folder_id || null) === currentFolderId)
    if (searchQuery.trim()) {
      filtered = files.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return filtered
  }, [files, currentFolderId, searchQuery])

  // Liste uniquement les images du dossier pour la visionneuse
  const currentImages = useMemo(() => {
    return currentFiles.filter(f => f.media_type?.startsWith('image'))
  }, [currentFiles])

  // Fil d'Ariane (Breadcrumbs)
  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Racine' }]
    let activeId = currentFolderId
    
    const path: FolderItem[] = []
    while (activeId) {
      const found = folders.find(f => f.id === activeId)
      if (found) {
        path.unshift(found)
        activeId = found.parent_id
      } else {
        break
      }
    }
    
    path.forEach(f => crumbs.push({ id: f.id, name: f.name }))
    return crumbs
  }, [currentFolderId, folders])

  // Création de dossier persisté
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    const newFolder: FolderItem = {
      id: 'folder_' + Date.now(),
      name: newFolderName.trim(),
      parent_id: currentFolderId
    }
    const updated = [...folders, newFolder]
    saveFolders(updated)
    setNewFolderName('')
    setShowNewFolderModal(false)
  }

  // Renommer un dossier
  const handleRenameFolder = (folderId: string, currentName: string) => {
    const name = prompt('Nouveau nom du dossier :', currentName)
    if (name && name.trim()) {
      const updated = folders.map(f => f.id === folderId ? { ...f, name: name.trim() } : f)
      saveFolders(updated)
    }
  }

  // Supprimer un dossier
  const handleDeleteFolder = (folderId: string) => {
    if (!confirm('Supprimer ce dossier et son contenu ?')) return
    const updated = folders.filter(f => f.id !== folderId && f.parent_id !== folderId)
    saveFolders(updated)
    setFiles(prev => prev.filter(f => f.folder_id !== folderId))
  }

  // Déplacer un fichier vers un autre dossier
  const handleMoveFile = (targetFolderId: string | null) => {
    if (!movingFile) return
    setFiles(prev => prev.map(f => f.id === movingFile.id ? { ...f, folder_id: targetFolderId } : f))
    setMovingFile(null)
    setShowMoveModal(false)
  }

  // Upload d'un nouveau fichier dans le dossier courant
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    try {
      const fileToUpload = selectedFiles[0]
      const formData = new FormData()
      formData.append('file', fileToUpload)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Échec du téléversement')
      }

      const data = await response.json()
      const newFileItem: FileItem = {
        id: 'file_' + Date.now(),
        title: fileToUpload.name,
        url: data.url || data.path || data.image_url,
        media_type: fileToUpload.type || 'application/octet-stream',
        file_size: fileToUpload.size,
        folder_id: currentFolderId
      }

      // Enregistrer également dans Supabase dans la table media_files si non fait par la route d'API
      try {
        const supabase = createClient()
        await supabase.from('media_files').insert([{
          original_name: fileToUpload.name,
          public_url: data.url || data.path || data.image_url,
          mime_type: fileToUpload.type,
          size_bytes: fileToUpload.size,
          provider: 'cloudflare_r2'
        }]).select()
      } catch (errDb) {
        console.warn('Sauvegarde BDD optionnelle:', errDb)
      }

      setFiles(prev => [newFileItem, ...prev])
    } catch (err: any) {
      alert('Erreur lors du téléversement : ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // Suppression d'un fichier
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce fichier ?')) return
    try {
      const supabase = createClient()
      await supabase.from('media_files').delete().eq('id', fileId)
    } catch (e) {
      console.warn('Suppression BDD optionnelle:', e)
    }
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Clic sur un fichier
  const handleFileClick = (file: FileItem) => {
    if (isPickerMode && onSelectFile) {
      onSelectFile(file)
      return
    }

    if (file.media_type?.startsWith('image')) {
      const imgIdx = currentImages.findIndex(i => i.id === file.id)
      setActiveImageIndex(imgIdx >= 0 ? imgIdx : 0)
      setViewerOpen(true)
      return
    }

    window.open(file.url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Barre d'actions supérieure */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        {/* Fil d'Ariane (Breadcrumbs) */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id || 'root'} className="flex items-center text-sm">
              {idx > 0 && <ChevronRight size={16} className="text-gray-400 mx-1 flex-shrink-0" />}
              <button
                type="button"
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded-md transition ${
                  currentFolderId === crumb.id 
                    ? 'bg-[#014F43]/10 text-[#014F43] font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {crumb.id === null ? <Home size={16} /> : <Folder size={16} />}
                <span>{crumb.name}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Boutons d'action & Recherche */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Champ de recherche */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#014F43] focus:outline-none w-44 md:w-56"
            />
          </div>

          {/* Bascule Grille / Liste */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#014F43]' : 'text-gray-500'}`}
              title="Vue Grille"
            >
              <Grid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-[#014F43]' : 'text-gray-500'}`}
              title="Vue Liste"
            >
              <List size={16} />
            </button>
          </div>

          {/* Nouveau Dossier */}
          <button
            type="button"
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            <FolderPlus size={18} />
            <span className="hidden sm:inline">Nouveau dossier</span>
          </button>

          {/* Uploader Fichier */}
          <label className="flex items-center gap-2 px-4 py-2 bg-[#014F43] hover:bg-[#00362d] text-white rounded-lg text-sm font-medium cursor-pointer transition shadow-sm">
            <Upload size={18} />
            <span>{uploading ? 'Téléversement...' : 'Ajouter un fichier'}</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Contenu : Dossiers + Fichiers */}
      {currentFolders.length === 0 && currentFiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Folder size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium mb-1">Dossier vide</p>
          <p className="text-xs text-gray-400 mb-4">Créer un dossier ou ajouter des fichiers pour commencer</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* VUE GRILLE */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Affichage des dossiers */}
          {currentFolders.map(folder => (
            <div
              key={folder.id}
              onClick={() => setCurrentFolderId(folder.id)}
              className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-[#014F43] hover:shadow-md cursor-pointer transition flex flex-col items-center justify-between text-center relative"
            >
              <Folder size={48} className="text-[#014F43]/80 group-hover:scale-105 transition-transform mb-2" />
              <span className="font-semibold text-gray-800 text-sm line-clamp-1 w-full">{folder.name}</span>
              
              {/* Menu d'actions rapides sur le dossier */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white/90 p-1 rounded-md shadow border">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameFolder(folder.id, folder.name)
                  }}
                  className="p-1 text-gray-600 hover:text-black"
                  title="Renommer"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFolder(folder.id)
                  }}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Affichage des fichiers */}
          {currentFiles.map(file => {
            const isImage = file.media_type?.startsWith('image')
            const isPdf = file.media_type?.includes('pdf')

            return (
              <div
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="group bg-white rounded-xl border border-gray-200 hover:border-[#014F43] hover:shadow-md overflow-hidden cursor-pointer transition flex flex-col relative"
              >
                {/* Zone Aperçu */}
                <div className="h-32 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <Image
                      src={file.url}
                      alt={file.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : isPdf ? (
                    <FileText size={40} className="text-red-500" />
                  ) : (
                    <File size={40} className="text-gray-400" />
                  )}

                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                    {isImage ? <Eye size={20} /> : <ExternalLink size={20} />}
                  </div>
                </div>

                {/* Info fichier */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1 mb-1">{file.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{file.file_size ? `${(file.file_size / 1024).toFixed(0)} KB` : 'Fichier'}</span>
                    
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMovingFile(file)
                          setShowMoveModal(true)
                        }}
                        className="text-gray-600 hover:text-black p-1 bg-gray-100 rounded"
                        title="Ranger dans un dossier"
                      >
                        <FolderInput size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFile(file.id)
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Supprimer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* VUE LISTE */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Taille</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {currentFolders.map(folder => (
                <tr 
                  key={folder.id} 
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 flex items-center gap-3 font-semibold text-gray-800">
                    <Folder size={20} className="text-[#014F43]" />
                    <span>{folder.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">Dossier</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">-</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFolder(folder.id)
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {currentFiles.map(file => (
                <tr 
                  key={file.id} 
                  onClick={() => handleFileClick(file)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 flex items-center gap-3 font-medium text-gray-800">
                    {file.media_type?.startsWith('image') ? (
                      <ImageIcon size={20} className="text-blue-500" />
                    ) : (
                      <FileText size={20} className="text-red-500" />
                    )}
                    <span className="line-clamp-1">{file.title}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{file.media_type || 'Fichier'}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMovingFile(file)
                        setShowMoveModal(true)
                      }}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                      title="Déplacer"
                    >
                      <FolderInput size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFile(file.id)
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Création Nouveau Dossier */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Créer un nouveau dossier</h3>
            <input
              type="text"
              placeholder="Nom du dossier..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43]"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] text-sm font-semibold"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Déplacement de Fichier */}
      {showMoveModal && movingFile && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/50 p-4" style={{ zIndex: 60 }}>
          <div className="bg-white rounded-2xl shadow-2xl border p-6 max-w-md w-full space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Ranger le fichier</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">Fichier: {movingFile.title}</p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleMoveFile(null)}
                className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-100 text-left text-sm font-medium border border-transparent hover:border-gray-200 transition"
              >
                <Home size={16} className="text-[#014F43]" />
                <span>Racine (aucun dossier)</span>
              </button>

              {folders.map(folder => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleMoveFile(folder.id)}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-gray-100 text-left text-sm font-medium border border-transparent hover:border-gray-200 transition"
                >
                  <Folder size={16} className="text-[#014F43]" />
                  <span>{folder.name}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setMovingFile(null)
                  setShowMoveModal(false)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visionneuse d'images Lightbox */}
      <ImageViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        src={currentImages[activeImageIndex]?.url || ''}
        alt={currentImages[activeImageIndex]?.title || 'Visualisation image'}
        images={currentImages.map(i => i.url)}
        currentIndex={activeImageIndex}
        onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
      />
    </div>
  )
}
