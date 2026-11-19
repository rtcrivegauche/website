export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import PastPresidentsDirectory from '@/components/public/PastPresidentsDirectory'
import { Award } from 'lucide-react'

export const metadata = {
  title: 'Past-Présidents & Mandats - Rotaract Cotonou Rive Gauche Cica',
  description: 'Découvrez la galerie d\'honneur des anciens présidents et le mandat actuel du Club Rotaract de Cotonou Rive Gauche Cica.',
}

export default async function PastPresidentsPage() {
  const supabase = await createClient()

  const { data: presidents } = await supabase
    .from('presidents')
    .select('*')
    .order('is_current', { ascending: false })
    .order('display_order', { ascending: true })
    .order('term', { ascending: false })

  const validPresidents = presidents || []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#014F43] via-[#00362d] to-[#012620] text-white py-14 md:py-20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E11A60]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1320px] mx-auto px-6 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Award size={16} className="text-amber-300" />
              <span>Galerie d&apos;Honneur du Club</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Past-Présidents
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Découvrez les leaders dévoués qui ont guidé le Club Rotaract de Cotonou Rive Gauche Cica à travers leurs mandats, thèmes et réalisations marquantes.
            </p>
          </div>
        </section>

        {/* Répertoire interactif */}
        <section className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
          <PastPresidentsDirectory presidents={validPresidents} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
