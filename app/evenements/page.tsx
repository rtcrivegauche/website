export const dynamic = 'force-dynamic'

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events?.map((event) => (
              <Link
                key={event.id}
                href={`/evenements/${event.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100/50"
              >
                {event.featured_image_url && (
                  <div className="relative w-full aspect-square md:aspect-[1920/744] overflow-hidden">
                    <Image
                      src={event.featured_image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-555"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#014F43] p-3 rounded-xl text-center min-w-[70px]">
                        <span className="block text-2xl font-bold text-white">
                          {new Date(event.event_date).getDate()}
                        </span>
                        <span className="text-[10px] text-white/90 uppercase font-bold tracking-wider">
                          {new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(event.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {event.location}
                        </p>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#E11A60] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    En savoir plus et s'inscrire →
                  </div>
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
