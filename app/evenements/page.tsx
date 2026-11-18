export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import EventsTimelineList from '@/components/public/EventsTimelineList'

export const metadata = {
  title: 'Nos Événements - Rotaract Cotonou Rive Gauche Cica',
  description: 'Découvrez notre calendrier des réunions statutaires, conférences, ateliers et événements associatifs.',
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('event_date', { ascending: false })

  return (
    <div className="min-h-screen low-poly-bg flex flex-col justify-between">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#014F43] tracking-tight mb-4">
              Nos Événements
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Rejoignez-nous lors de nos prochaines rencontres statutaires, conférences, et revivez nos moments d'échange marquants.
            </p>
          </div>

          <EventsTimelineList events={events || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
