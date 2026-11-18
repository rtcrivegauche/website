import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '@/components/admin/DeleteButton'
import ReorderRowButtons from '@/components/admin/ReorderRowButtons'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('display_order', { ascending: true })
    .order('event_date', { ascending: false })

  const allIds = events?.map((e) => e.id) || []

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Événements</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Gérez le calendrier des événements et conférences. Utilisez ▲ / ▼ pour ajuster leur position.
          </p>
        </div>
        <Link
          href="/admin/evenements/nouveau"
          className="w-full sm:w-auto px-5 py-2.5 bg-[#22C83A] text-white rounded-lg hover:bg-[#1ab030] transition font-medium text-center shadow-sm"
        >
          + Nouvel événement
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lieu
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
            {events?.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {event.featured_image_url && (
                      <div className="relative w-12 h-12 mr-3">
                        <Image
                          src={event.featured_image_url}
                          alt={event.title}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      {event.gallery_images && event.gallery_images.length > 0 && (
                        <div className="text-[11px] text-gray-400">
                          📷 {event.gallery_images.length} photo{event.gallery_images.length > 1 ? 's' : ''} dans l'album
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(event.event_date).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(event.event_date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ReorderRowButtons
                    table="events"
                    itemId={event.id}
                    currentIndex={index}
                    allIds={allIds}
                    revalidatePath="/admin/evenements"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  {event.is_featured && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Mis en avant
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/evenements/${event.id}`}
                      className="text-[#014F43] hover:text-[#22C83A]"
                    >
                      Modifier
                    </Link>
                    <DeleteButton
                      table="events"
                      id={event.id}
                      itemName={event.title}
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
