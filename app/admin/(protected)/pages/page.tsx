import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, Trash2 } from 'lucide-react'

export default async function CustomPagesPage() {
  const supabase = await createClient()
  
  const { data: pages, error } = await supabase
    .from('custom_pages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pages:', error)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages personnalisées</h1>
          <p className="text-gray-600 mt-2">
            Créez des pages avec contenu personnalisé ou formulaires intégrés (Tally, etc.)
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
        >
          <Plus size={20} />
          Nouvelle page
        </Link>
      </div>

      {!pages || pages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">Aucune page personnalisée pour le moment</p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors"
          >
            <Plus size={20} />
            Créer votre première page
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Slug
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{page.title}</div>
                    {page.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {page.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      /p/{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {page.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {page.is_published ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye size={12} />
                        Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <EyeOff size={12} />
                        Brouillon
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {page.is_published && (
                        <Link
                          href={`/p/${page.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-[#014F43] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir la page"
                        >
                          <Eye size={18} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-2 text-gray-600 hover:text-[#014F43] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
