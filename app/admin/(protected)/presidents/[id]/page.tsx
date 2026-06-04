import { createClient } from '@/lib/supabase/server'
import PresidentForm from '@/components/admin/PresidentForm'

interface EditPresidentPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditPresidentPageProps) {
  const { id } = await params
  return {
    title: `Modifier le Président - Administration`
  }
}

export default async function EditPresidentPage({ params }: EditPresidentPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: president, error } = await supabase
    .from('presidents')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching president for edit:', error)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
        Modifier le Président
      </h1>
      <PresidentForm president={president} />
    </div>
  )
}
