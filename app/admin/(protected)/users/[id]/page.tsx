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

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (!user) {
    notFound()
  }

  // Mapper pour correspondre aux propriétés attendues par UserRoleForm (id, user_id, role_id, is_active)
  const userRole = {
    id: user.id,
    user_id: user.id,
    role_id: user.role_id || '',
    is_active: user.is_active ?? true
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier l'utilisateur</h1>
      <UserRoleForm userRole={userRole} roles={roles || []} />
    </div>
  )
}
