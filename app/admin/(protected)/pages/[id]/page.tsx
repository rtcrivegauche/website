import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CustomPageForm from '@/components/admin/CustomPageForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCustomPagePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: page, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Modifier la page</h1>
        <p className="text-gray-600 mt-2">
          Modifiez le contenu ou les paramètres de votre page personnalisée
        </p>
      </div>

      <CustomPageForm page={page} />
    </div>
  )
}
