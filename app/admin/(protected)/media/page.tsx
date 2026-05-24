import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Copy, Trash2, Image as ImageIcon, Video, File } from 'lucide-react'

export default async function MediaPage() {
  const supabase = await createClient()
  
  const { data: media } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false })

  const getMediaIcon = (type: string) => {
    if (type?.startsWith('image')) return ImageIcon
    if (type?.startsWith('video')) return Video
    return File
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bibliothèque de médias</h1>
          <p className="text-gray-600 mt-2">
            Gérez tous vos fichiers médias (images, vidéos, documents)
          </p>
        </div>
        <Link
          href="/admin/media/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter un média
        </Link>
      </div>

      {!media || media.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Aucun média dans la bibliothèque</p>
          <Link
            href="/admin/media/nouveau"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
          >
            <Plus size={20} />
            Ajouter votre premier média
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => {
            const Icon = getMediaIcon(item.media_type)
            const isImage = item.media_type?.startsWith('image')

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  {isImage && item.url ? (
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Icon size={48} className="text-gray-400" />
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {item.media_type} • {item.file_size ? `${(item.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.url)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      title="Copier l'URL"
                    >
                      <Copy size={14} />
                      Copier
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total de médias</p>
            <p className="text-2xl font-bold text-gray-900">{media?.length || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Images</p>
            <p className="text-2xl font-bold text-gray-900">
              {media?.filter(m => m.media_type?.startsWith('image')).length || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Vidéos</p>
            <p className="text-2xl font-bold text-gray-900">
              {media?.filter(m => m.media_type?.startsWith('video')).length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
