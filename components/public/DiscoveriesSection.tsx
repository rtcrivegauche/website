import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Compass, Calendar, MapPin, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_DISCOVERIES = [
  {
    id: 'h1',
    title: 'Immersion Culturelle et Historique à Ouidah',
    slug: 'immersion-culturelle-ouidah',
    description: 'Une journée mémorable à la découverte du patrimoine historique, de la mémoire vivante et des richesses de notre pays.',
    featured_image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-10-24',
    location: 'Ouidah, Bénin',
  },
  {
    id: 'h2',
    title: 'Visite des Écosystèmes et Rives du Lac Nokoué',
    slug: 'visite-ecosystemes-lac-nokoue',
    description: 'Exploration en pirogue et rencontre avec les communautés lacustres de Ganvié pour comprendre les enjeux environnementaux.',
    featured_image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-09-12',
    location: 'Ganvié, Lac Nokoué',
  },
  {
    id: 'h3',
    title: 'Découverte des Métiers Maritimes au Port de Cotonou',
    slug: 'decouverte-metiers-maritimes-port-cotonou',
    description: 'Visite guidée des installations portuaires et échanges passionnants sur les chaînes logistiques et le commerce international.',
    featured_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-08-18',
    location: 'Port de Cotonou',
  }
]

export default async function DiscoveriesSection() {
  let discoveries = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discoveries')
      .select('id, title, slug, description, featured_image_url, discovery_date, location')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('discovery_date', { ascending: false })
      .limit(3)

    if (!error && data && data.length > 0) {
      discoveries = data
    } else {
      discoveries = FALLBACK_DISCOVERIES
    }
  } catch {
    discoveries = FALLBACK_DISCOVERIES
  }

  if (!discoveries || discoveries.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-12 md:py-16">
      {/* En-tête de la section */}
      <div className="flex justify-between items-end mb-8 px-6">
        <div>
          <div className="flex items-center gap-2 text-[#E11A60] text-xs font-bold uppercase tracking-widest mb-2">
            <Compass size={15} />
            <span>Évasion & Fraternité</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#014F43] max-w-xs md:max-w-xl tracking-tight leading-tight">
            Nos Découvertes & Immersions
          </h2>
        </div>
        
        <Link 
          href="/decouvertes" 
          className="text-[#014F43] hover:text-[#E11A60] transition-colors flex items-center gap-1.5 mb-1 md:mb-2 flex-shrink-0"
          aria-label="Voir toutes les découvertes"
        >
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline underline underline-offset-4">
            VOIR TOUTES LES DÉCOUVERTES
          </span>
          <span className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 md:hidden transition-colors">
            <ChevronRight size={18} />
          </span>
        </Link>
      </div>

      {/* Grille des 3 cartes sur l'accueil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {discoveries.map((item) => (
          <Link
            key={item.id}
            href={`/decouvertes/${item.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                {item.featured_image_url ? (
                  <Image
                    src={item.featured_image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#014F43]/15 to-[#22C83A]/15 text-4xl">
                    🧭
                  </div>
                )}
                
                {/* Badge DÉCOUVERTE */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E11A60] text-white shadow-md flex items-center gap-1.5">
                    <Sparkles size={11} />
                    Découverte
                  </span>
                </div>

                {item.location && (
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                      <MapPin size={12} className="text-[#22C83A]" />
                      <span className="line-clamp-1">{item.location}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {item.discovery_date && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Calendar size={13} />
                    <span>
                      {new Date(item.discovery_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-black text-[#014F43] group-hover:text-[#E11A60] transition-colors leading-snug mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-[#014F43] group-hover:text-[#E11A60] transition-colors uppercase tracking-wider">
              <span>Voir la sortie</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
