export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import DiscoveriesTimelineList from '@/components/public/DiscoveriesTimelineList'
import { Compass } from 'lucide-react'

// Données de secours de haute qualité au cas où la table n'a pas encore été migrée sur Supabase
const FALLBACK_DISCOVERIES = [
  {
    id: 'f1',
    title: 'Immersion Culturelle et Historique à Ouidah',
    slug: 'immersion-culturelle-ouidah',
    description: 'Une journée mémorable à la découverte du patrimoine historique, de la Route des Esclaves, du Temple des Pythons et de la mémoire vivante de notre pays.',
    featured_image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-10-24',
    discovery_time: '08h00 - 17h30',
    location: 'Ouidah, Bénin',
    activity_type: 'Immersion Historique',
    fee: 'Gratuit',
    is_published: true,
  },
  {
    id: 'f2',
    title: 'Visite des Écosystèmes et Rives du Lac Nokoué',
    slug: 'visite-ecosystemes-lac-nokoue',
    description: 'Exploration en pirogue et rencontre avec les communautés de Ganvié pour appréhender les enjeux environnementaux, l\'artisanat local et la résilience écologique.',
    featured_image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-09-12',
    discovery_time: '09h00 - 15h00',
    location: 'Ganvié, Lac Nokoué',
    activity_type: 'Excursion Écologique',
    fee: '3 000 FCFA',
    is_published: true,
  },
  {
    id: 'f3',
    title: 'Découverte des Métiers Maritimes au Port de Cotonou',
    slug: 'decouverte-metiers-maritimes-port-cotonou',
    description: 'Visite guidée des installations portuaires, échanges avec des experts en logistique internationale et découverte du moteur économique du Bénin.',
    featured_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-08-18',
    discovery_time: '10h00 - 13h00',
    location: 'Port Autonome de Cotonou',
    activity_type: 'Visite Professionnelle',
    fee: 'Gratuit',
    is_published: true,
  }
]

export const metadata = {
  title: 'Découvertes & Immersions - Rotaract Cotonou Rive Gauche Cica',
  description: 'Explorez nos activités d\'éveil, visites culturelles, voyages d\'études et immersions professionnelles.',
}

export default async function DecouvertesPublicPage() {
  let discoveries = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discoveries')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('discovery_date', { ascending: false })

    if (!error && data && data.length > 0) {
      discoveries = data
    } else {
      discoveries = FALLBACK_DISCOVERIES
    }
  } catch {
    discoveries = FALLBACK_DISCOVERIES
  }

  return (
    <div className="min-h-screen low-poly-bg flex flex-col justify-between">
      <Header />
      
      <main className="mt-24 py-16 px-6">
        <div className="max-w-[1320px] mx-auto">
          {/* En-tête de la page */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E11A60]/10 text-[#E11A60] font-bold text-xs uppercase tracking-widest mb-4">
              <Compass size={15} />
              <span>Aventures, Métiers & Terroirs</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#014F43] tracking-tight leading-tight mb-6">
              Nos Découvertes & Immersions
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Au-delà de nos réunions et de nos actions d'intérêt public, nous explorons nos terroirs, 
              nos industries et notre culture pour élargir nos horizons et renforcer notre fraternité.
            </p>
          </div>

          {/* Liste interactive avec filtres À venir / Passées */}
          <DiscoveriesTimelineList discoveries={discoveries} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
