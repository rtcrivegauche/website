import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GalleryItemForm from '@/components/admin/GalleryItemForm'

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let item = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('id', id)
      .single()
    
    item = data
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {item ? 'Modifier l\'image' : 'Ajouter une image'}
      </h1>
      <GalleryItemForm item={item} />
    </div>
  )
}
