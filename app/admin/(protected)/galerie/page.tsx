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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galerie</h1>
          <p className="text-gray-600 mt-2">
            Gérez les photos et images du club avec prévisualisation plein écran
          </p>
        </div>
        <Link
          href="/admin/galerie/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Ajouter une image
        </Link>
      </div>

      <GalleryListClient initialItems={items || []} />
    </div>
  )
}
