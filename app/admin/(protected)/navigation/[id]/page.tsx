import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NavigationForm from '@/components/admin/NavigationForm'

interface NavigationPageProps {
  params: Promise<{ id: string }>
}

export default async function NavigationPage({ params }: NavigationPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: allItems } = await supabase
    .from('navigation_items')
    .select('*')
    .order('order_index')

  if (id === 'nouveau') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un lien</h1>
        <NavigationForm parentItems={allItems || []} />
      </div>
    )
  }

  const { data: navItem } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('id', id)
    .single()

  if (!navItem) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier le lien</h1>
      <NavigationForm navItem={navItem} parentItems={allItems || []} />
    </div>
  )
}
