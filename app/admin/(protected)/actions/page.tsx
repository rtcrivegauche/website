import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '@/components/admin/DeleteButton'
import ReorderRowButtons from '@/components/admin/ReorderRowButtons'

export default async function ActionsPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*')
    .order('display_order', { ascending: true })

  const allIds = actions?.map((a) => a.id) || []

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Actions & Projets</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Gérez les réalisations communautaires du club. Réordonnez avec ▲ / ▼ pour ajuster l'affichage sur le site.
          </p>
        </div>
        <Link
          href="/admin/actions/nouveau"
          className="w-full sm:w-auto px-5 py-2.5 bg-[#22C83A] text-white rounded-lg hover:bg-[#1ab030] transition font-medium text-center shadow-sm"
        >
          + Nouvelle action
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ordre (Glisser ▲ / ▼)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actions?.map((action, index) => (
              <tr key={action.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {action.featured_image_url && (
                      <div className="relative w-12 h-12 mr-3">
                        <Image
                          src={action.featured_image_url}
                          alt={action.title}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {action.title}
                      </div>
                      {action.gallery_images && action.gallery_images.length > 0 && (
                        <div className="text-[11px] text-gray-400">
                          📷 {action.gallery_images.length} photo{action.gallery_images.length > 1 ? 's' : ''} dans l'album
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {action.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ReorderRowButtons
                    table="actions"
                    itemId={action.id}
                    currentIndex={index}
                    allIds={allIds}
                    revalidatePath="/admin/actions"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      action.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {action.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  {action.is_featured && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Mis en avant
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/actions/${action.id}`}
                      className="text-[#014F43] hover:text-[#22C83A]"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      table="actions"
                      id={action.id}
                      itemName={action.title}
                      variant="table-action"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
