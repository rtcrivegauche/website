import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let event = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    event = data
    
    if (!event) {
      redirect('/admin/evenements')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {event ? 'Modifier l\'événement' : 'Nouvel événement'}
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <EventForm event={event} />
      </div>
    </div>
  )
}
