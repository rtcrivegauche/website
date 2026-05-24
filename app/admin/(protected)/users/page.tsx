import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, UserCog } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('user_roles')
    .select(`
      *,
      roles (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs Admin</h1>
          <p className="text-gray-600 mt-2">
            Gérez les utilisateurs ayant accès au dashboard
          </p>
        </div>
        <Link
          href="/admin/users/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter un utilisateur
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#014F43]/10 rounded-full flex items-center justify-center">
                      <UserCog className="text-[#014F43]" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.user_id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.roles ? (
                    <span className="px-3 py-1 bg-[#014F43]/10 text-[#014F43] rounded-full text-sm font-medium">
                      {user.roles.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">Aucun rôle</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-[#014F43] hover:text-[#00362d] font-medium text-sm"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users || users.length === 0 && (
          <div className="p-12 text-center">
            <UserCog size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Aucun utilisateur</p>
            <Link
              href="/admin/users/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
            >
              <Plus size={20} />
              Ajouter votre premier utilisateur
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
