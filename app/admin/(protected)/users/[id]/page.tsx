import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import UserRoleForm from '@/components/admin/UserRoleForm'

interface UserPageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: roles } = await supabase
    .from('roles')
    .select('*')
    .order('name')

  if (id === 'nouveau') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un utilisateur</h1>
        <UserRoleForm roles={roles || []} />
      </div>
    )
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('id', id)
    .single()

  if (!userRole) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier l'utilisateur</h1>
      <UserRoleForm userRole={userRole} roles={roles || []} />
    </div>
  )
}
