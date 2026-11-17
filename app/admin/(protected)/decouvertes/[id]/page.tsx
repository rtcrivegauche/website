import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DiscoveryForm from '@/components/admin/DiscoveryForm'

export default async function EditDiscoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let discovery = null

  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('discoveries')
      .select('*')
      .eq('id', id)
      .single()

    discovery = data

    if (!discovery) {
      redirect('/admin/decouvertes')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {discovery ? 'Modifier la découverte' : 'Nouvelle découverte'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {discovery
            ? 'Mettez à jour les informations et photos de cette sortie'
            : 'Ajoutez une nouvelle activité d\'immersion, de découverte ou d\'échange'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <DiscoveryForm discovery={discovery} />
      </div>
    </div>
  )
}
