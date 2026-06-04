export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <article className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            {event.featured_image_url && (
              <div className="relative w-full aspect-square md:aspect-[1920/744]">
                <Image
                  src={event.featured_image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-[#014F43] p-6 rounded-xl text-center min-w-[100px]">
                  <span className="block text-5xl font-bold text-white">
                    {new Date(event.event_date).getDate()}
                  </span>
                  <span className="text-sm text-white uppercase">
                    {new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'long' })}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#014F43] mb-2">
                    {event.title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {new Date(event.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {event.location}
                  </p>
                  {event.location_address && (
                    <p className="text-gray-500">{event.location_address}</p>
                  )}
                </div>
              </div>

              {event.description && (
                <div className="mb-8 leading-relaxed">
                  <SafeHtmlRenderer html={event.description} />
                </div>
              )}

              {event.speaker_name && (
                <div className="bg-gray-50 p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-bold text-[#014F43] mb-4">Intervenant</h3>
                  <div className="flex items-center gap-4">
                    {event.speaker_photo_url && (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden">
                        <Image
                          src={event.speaker_photo_url}
                          alt={event.speaker_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-bold text-[#014F43]">{event.speaker_name}</p>
                      {event.speaker_title && (
                        <p className="text-gray-600">{event.speaker_title}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {event.registration_url && (
                <div className="text-center">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-4 bg-[#22C83A] text-white rounded-lg font-bold hover:bg-[#1ab030] transition text-lg"
                  >
                    S'inscrire à l'événement
                  </a>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
