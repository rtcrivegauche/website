import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MemberForm from '@/components/admin/MemberFormNew'

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let member = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()
    
    member = data
    
    if (!member) {
      redirect('/admin/membres')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {member ? 'Modifier le membre' : 'Nouveau membre'}
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <MemberForm member={member} />
      </div>
    </div>
  )
}
