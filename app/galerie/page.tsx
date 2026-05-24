import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Camera } from 'lucide-react'

export default async function GaleriePage() {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .order('created_at', { ascending: false })

  const categories = [...new Set(items?.map(i => i.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Camera size={32} />
            <h1 className="text-4xl md:text-5xl font-bold">Galerie</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Revivez nos moments forts en images
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#014F43] text-white rounded-lg font-medium">
            Toutes
          </button>
          {categories.map(category => (
            <button
              key={category}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Galerie */}
      <section className="max-w-[1320px] mx-auto px-6 pb-16">
        {!items || items.length === 0 ? (
          <div className="text-center py-16">
            <Camera size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aucune image dans la galerie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="relative h-64 bg-gray-100">
                  {item.media_url && (
                    <Image
                      src={item.media_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2">
                      {item.category}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
