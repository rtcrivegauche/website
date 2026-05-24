import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('event_date', { ascending: false })

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#014F43] mb-4">
            Nos Événements
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Rejoignez-nous lors de nos prochaines rencontres et activités
          </p>

          <div className="space-y-8">
            {events?.map((event) => (
              <Link
                key={event.id}
                href={`/evenements/${event.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row"
              >
                {event.featured_image_url && (
                  <div className="relative h-64 md:h-auto md:w-1/3 overflow-hidden">
                    <Image
                      src={event.featured_image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#014F43] p-4 rounded-lg text-center min-w-[80px]">
                      <span className="block text-3xl font-bold text-white">
                        {new Date(event.event_date).getDate()}
                      </span>
                      <span className="text-xs text-white uppercase">
                        {new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#014F43] group-hover:text-[#22C83A] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(event.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {event.location}
                      </p>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
