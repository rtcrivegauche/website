import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import RoleForm from '@/components/admin/RoleForm'

interface RolePageProps {
  params: Promise<{ id: string }>
}

export default async function RolePage({ params }: RolePageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (id === 'nouveau') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un rôle</h1>
        <RoleForm />
      </div>
    )
  }

  const { data: role } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single()

  if (!role) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier le rôle</h1>
      <RoleForm role={role} />
    </div>
  )
}
