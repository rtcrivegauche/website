import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Compass, Calendar, MapPin } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'
import ReorderRowButtons from '@/components/admin/ReorderRowButtons'

export const metadata = {
  title: 'Gestion des Découvertes - Administration',
  description: 'Gérez les fiches et sorties de découverte, visites culturelles et immersions.',
}

export default async function DecouvertesAdminPage() {
  const supabase = await createClient()
  const { data: discoveries, error } = await supabase
    .from('discoveries')
    .select('*')
    .order('display_order', { ascending: true })
    .order('discovery_date', { ascending: false })

  if (error) {
    console.error('Error fetching discoveries:', error)
  }

  const allIds = discoveries?.map((d) => d.id) || []

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#014F43]">
            <Compass size={28} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Découvertes & Immersions</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Gérez les visites culturelles, excursions d'éveil et immersions. Utilisez ▲ / ▼ pour définir leur ordre sur le site.
          </p>
        </div>
        <Link
          href="/admin/decouvertes/nouveau"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#22C83A] text-white rounded-xl hover:bg-[#1ab030] transition font-bold text-center shadow-sm"
        >
          <Plus size={20} />
          + Nouvelle découverte
        </Link>
      </div>

      {!discoveries || discoveries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-[#014F43]/10 text-[#014F43] rounded-full flex items-center justify-center mx-auto mb-4">
            <Compass size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune découverte pour le moment</h3>
          <p className="text-gray-500 text-sm mb-6">
            Créez des fiches de découverte pour valoriser les visites, sorties et immersions du club qui ne sont ni des réunions ni des actions classiques.
          </p>
          <Link
            href="/admin/decouvertes/nouveau"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#014F43] text-white rounded-xl hover:bg-[#00362d] font-bold text-sm transition"
          >
            <Plus size={18} />
            Créer la première fiche Découverte
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Découverte / Sortie
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ordre (Glisser ▲ / ▼)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discoveries.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.featured_image_url ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                          <Image
                            src={item.featured_image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#014F43]/10 text-[#014F43] flex items-center justify-center font-bold text-lg flex-shrink-0">
                          🧭
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</div>
                        )}
                        {item.gallery_images && item.gallery_images.length > 0 && (
                          <div className="text-[11px] text-gray-400">
                            📷 {item.gallery_images.length} photo{item.gallery_images.length > 1 ? 's' : ''} dans l'album
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.discovery_date ? (
                      <div className="flex items-center gap-1.5 font-medium text-xs">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.discovery_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.location ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <MapPin size={14} className="text-gray-400" />
                        {item.location}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ReorderRowButtons
                      table="discoveries"
                      itemId={item.id}
                      currentIndex={index}
                      allIds={allIds}
                      revalidatePath="/admin/decouvertes"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          item.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.is_published ? 'Publié' : 'Brouillon'}
                      </span>
                      {item.is_featured && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-yellow-100 text-yellow-800">
                          À la une
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/decouvertes/${item.id}`}
                        className="text-[#014F43] hover:text-[#22C83A] font-semibold text-xs transition-colors"
                      >
                        Modifier
                      </Link>
                      <DeleteButton
                        table="discoveries"
                        id={item.id}
                        itemName={item.title}
                        variant="table-action"
                      />
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
