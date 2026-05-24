import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Shield } from 'lucide-react'

export default async function RolesPage() {
  const supabase = await createClient()
  
  const { data: roles } = await supabase
    .from('roles')
    .select('*')
    .order('name')

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rôles & Permissions</h1>
          <p className="text-gray-600 mt-2">
            Gérez les rôles utilisateurs et leurs permissions
          </p>
        </div>
        <Link
          href="/admin/roles/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Créer un rôle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#014F43]/10 rounded-full flex items-center justify-center">
                  <Shield className="text-[#014F43]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{role.name}</h3>
                  {role.description && (
                    <p className="text-sm text-gray-600">{role.description}</p>
                  )}
                </div>
              </div>
            </div>

            {role.permissions && typeof role.permissions === 'object' && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(role.permissions as Record<string, any>)
                    .filter(([_, value]) => value === true)
                    .slice(0, 3)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded uppercase text-[10px] font-semibold"
                      >
                        {key.replace('menu_', '')}
                      </span>
                    ))}
                  {Object.entries(role.permissions as Record<string, any>).filter(([_, value]) => value === true).length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{Object.entries(role.permissions as Record<string, any>).filter(([_, value]) => value === true).length - 3}
                    </span>
                  )}
                  {Object.entries(role.permissions as Record<string, any>).filter(([_, value]) => value === true).length === 0 && (
                    <span className="text-xs text-gray-400 italic">Aucune permission active</span>
                  )}
                </div>
              </div>
            )}

            <Link
              href={`/admin/roles/${role.id}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit size={16} />
              Modifier
            </Link>
          </div>
        ))}
      </div>

      {!roles || roles.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Aucun rôle créé</p>
          <Link
            href="/admin/roles/nouveau"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
          >
            <Plus size={20} />
            Créer votre premier rôle
          </Link>
        </div>
      )}
    </div>
  )
}
