import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ActionForm from '@/components/admin/ActionForm'

export default async function EditActionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let action = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('actions')
      .select('*')
      .eq('id', id)
      .single()
    
    action = data
    
    if (!action) {
      redirect('/admin/actions')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {action ? 'Modifier l\'action' : 'Nouvelle action'}
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ActionForm action={action} />
      </div>
    </div>
  )
}
