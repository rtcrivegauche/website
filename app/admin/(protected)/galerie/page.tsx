import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import GalleryListClient from '@/components/admin/GalleryListClient'

export default async function GaleriePage() {
  const supabase = await createClient()
  
  const { data: items, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching gallery items:', error)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Galerie</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Gérez les photos et images du club avec prévisualisation plein écran
          </p>
        </div>
        <Link
          href="/admin/galerie/nouveau"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors shadow-sm font-medium text-center"
        >
          <Plus size={20} />
          Ajouter une image
        </Link>
      </div>

      <GalleryListClient initialItems={items || []} />
    </div>
  )
}
