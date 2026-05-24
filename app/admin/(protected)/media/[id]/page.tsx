import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MediaForm from '@/components/admin/MediaForm'

interface MediaPageProps {
  params: Promise<{ id: string }>
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { id } = await params

  if (id === 'nouveau') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un média</h1>
        <MediaForm />
      </div>
    )
  }

  const supabase = await createClient()
  const { data: media } = await supabase
    .from('media_items')
    .select('*')
    .eq('id', id)
    .single()

  if (!media) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier le média</h1>
      <MediaForm media={media} />
    </div>
  )
}
