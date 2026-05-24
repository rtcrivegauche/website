import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Menu, Trash2, GripVertical } from 'lucide-react'

export default async function NavigationPage() {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from('navigation_items')
    .select('*')
    .order('order_index')

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
          <p className="text-gray-600 mt-2">
            Gérez les menus de navigation du site
          </p>
        </div>
        <Link
          href="/admin/navigation/nouveau"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Ajouter un lien
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Menu principal</h2>
        
        {!items || items.length === 0 ? (
          <div className="text-center py-12">
            <Menu size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Aucun lien de navigation</p>
            <Link
              href="/admin/navigation/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
            >
              <Plus size={20} />
              Ajouter votre premier lien
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <GripVertical size={20} className="text-gray-400 cursor-move" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    {!item.is_active && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.url}</p>
                  {item.parent_id && (
                    <p className="text-xs text-gray-500 mt-1">Sous-menu</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/navigation/${item.id}`}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> Pour que les modifications soient visibles sur le site, 
          vous devez mettre à jour le composant Header.tsx pour utiliser ces données dynamiques.
        </p>
      </div>
    </div>
  )
}
