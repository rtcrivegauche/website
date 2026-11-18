export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ActionsTimelineList from '@/components/public/ActionsTimelineList'

export const metadata = {
  title: 'Nos Actions & Projets - Rotaract Cotonou Rive Gauche Cica',
  description: 'Découvrez nos initiatives concrètes pour la santé, l\'éducation, l\'environnement et le leadership communautaire.',
}

export default async function ActionsPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen low-poly-bg flex flex-col justify-between">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#014F43] tracking-tight mb-4">
              Nos Actions & Projets
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Découvrez nos initiatives à fort impact pour la communauté : santé, éducation, écologie et autonomisation.
            </p>
          </div>

          <ActionsTimelineList actions={actions || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
