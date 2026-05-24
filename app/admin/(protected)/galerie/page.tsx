import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default async function GaleriePage() {
  const supabase = await createClient()
  
  const { data: items, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching gallery items:', error)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galerie</h1>
          <p className="text-gray-600 mt-2">
            Gérez les photos et images du club
          </p>
        </div>
        <Link
          href="/admin/galerie/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter une image
        </Link>
      </div>

      {!items || items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Aucune image dans la galerie</p>
          <Link
            href="/admin/galerie/nouveau"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
          >
            <Plus size={20} />
            Ajouter votre première image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
              <div className="relative h-48 bg-gray-100">
                {item.media_url && (
                  <Image
                    src={item.media_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                    {item.category}
                  </span>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/galerie/${item.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <Edit size={16} />
                    Modifier
                  </Link>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
