export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import { Calendar, MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react'

// Données de secours de haute qualité au cas où la table n'a pas encore été migrée sur Supabase
const FALLBACK_DISCOVERIES = [
  {
    id: 'f1',
    title: 'Immersion Culturelle et Historique à Ouidah',
    slug: 'immersion-culturelle-ouidah',
    description: 'Une journée mémorable à la découverte du patrimoine historique, de la Route des Esclaves, du Temple des Pythons et de la mémoire vivante de notre pays.',
    featured_image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-10-24',
    location: 'Ouidah, Bénin',
    is_published: true,
  },
  {
    id: 'f2',
    title: 'Visite des Écosystèmes et Rives du Lac Nokoué',
    slug: 'visite-ecosystemes-lac-nokoue',
    description: 'Exploration en pirogue et rencontre avec les communautés de Ganvié pour appréhender les enjeux environnementaux, l\'artisanat local et la résilience écologique.',
    featured_image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-09-12',
    location: 'Ganvié, Lac Nokoué',
    is_published: true,
  },
  {
    id: 'f3',
    title: 'Découverte des Métiers Maritimes au Port de Cotonou',
    slug: 'decouverte-metiers-maritimes-port-cotonou',
    description: 'Visite guidée des installations portuaires, échanges avec des experts en logistique internationale et découverte du moteur économique du Bénin.',
    featured_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-08-18',
    location: 'Port Autonome de Cotonou',
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
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E11A60]/10 text-[#E11A60] font-bold text-xs uppercase tracking-widest mb-4">
              <Compass size={15} />
              <span>Aventures & Expériences</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#014F43] tracking-tight leading-tight mb-6">
              Nos Découvertes & Immersions
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Au-delà de nos réunions et de nos actions d'intérêt public, nous explorons le monde, 
              nos terroirs, nos industries et notre culture pour élargir nos horizons et renforcer notre fraternité.
            </p>
          </div>

          {/* Grille des cartes de découverte */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {discoveries.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo de couverture */}
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    {item.featured_image_url ? (
                      <Image
                        src={item.featured_image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#014F43]/15 to-[#22C83A]/15 text-5xl">
                        🧭
                      </div>
                    )}
                    
                    {/* Badge DÉCOUVERTE */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E11A60] text-white shadow-md flex items-center gap-1.5">
                        <Sparkles size={12} />
                        Découverte
                      </span>
                    </div>

                    {/* Badge Lieu */}
                    {item.location && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                          <MapPin size={13} className="text-[#22C83A]" />
                          <span className="line-clamp-1">{item.location}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-6 sm:p-7">
                    {item.discovery_date && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Calendar size={13} />
                        <span>
                          {new Date(item.discovery_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <h2 className="text-xl font-black text-[#014F43] group-hover:text-[#E11A60] transition-colors leading-snug mb-3">
                      <Link href={`/decouvertes/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h2>

                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pied de carte avec lien */}
                <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/decouvertes/${item.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#014F43] group-hover:text-[#E11A60] transition-colors"
                  >
                    <span>Explorer le récit</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
