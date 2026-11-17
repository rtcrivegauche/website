export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'
import { Calendar, MapPin, ArrowLeft, Compass, Sparkles } from 'lucide-react'

const FALLBACK_DISCOVERIES = [
  {
    id: 'f1',
    title: 'Immersion Culturelle et Historique à Ouidah',
    slug: 'immersion-culturelle-ouidah',
    description: 'Une journée mémorable à la découverte du patrimoine historique, de la Route des Esclaves, du Temple des Pythons et de la mémoire vivante de notre pays.',
    content: `
      <p class="mb-4">Le Rotaract Club de Cotonou Rive Gauche Cica a organisé une sortie d'immersion culturelle et historique exceptionnelle dans la cité historique de Ouidah.</p>
      <p class="mb-4">Au programme : la visite émouvante de la Route des Esclaves jusqu'à la Porte du Non-Retour, la découverte du Temple des Pythons et des échanges enrichissants avec des historiens et gardiens des traditions locales.</p>
      <p class="mb-4">Cette immersion a permis à nos membres de renforcer leurs liens fraternels tout en s'imprégnant de l'histoire et de la culture béninoise, source intarissable d'inspiration pour nos actions communautaires.</p>
    `,
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
    content: `
      <p class="mb-4">Nos membres se sont aventurés au cœur de la cité lacustre de Ganvié sur les eaux calmes du Lac Nokoué.</p>
      <p class="mb-4">Cette sortie nous a permis de rencontrer les artisans locaux, d'observer les dynamiques écologiques du milieu aquatique et de mieux comprendre les défis quotidiens liés à l'accès à l'eau potable et à la gestion des déchets en milieu lagunaire.</p>
    `,
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
    content: `
      <p class="mb-4">Dans le cadre du développement professionnel de nos membres, nous avons eu l'immense honneur d'effectuer une visite immersive exclusive au Port Autonome de Cotonou.</p>
      <p class="mb-4">Au-delà de la visite impressionnante des quais et des zones sous douane, des professionnels chevronnés du fret et de la logistique ont partagé leurs parcours et les opportunités professionnelles offertes par ce secteur stratégique.</p>
    `,
    featured_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
    discovery_date: '2026-08-18',
    location: 'Port Autonome de Cotonou',
    is_published: true,
  }
]

export default async function DiscoveryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let discovery = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('discoveries')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    discovery = data
  } catch {
    // fallback
  }

  if (!discovery) {
    discovery = FALLBACK_DISCOVERIES.find((d) => d.slug === slug)
  }

  if (!discovery) {
    notFound()
  }

  return (
    <div className="min-h-screen low-poly-bg flex flex-col justify-between">
      <Header />

      <main className="mt-24 py-16 px-6">
        <article className="max-w-4xl mx-auto">
          {/* Bouton retour */}
          <Link
            href="/decouvertes"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#014F43] uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Toutes les découvertes</span>
          </Link>

          {/* Image de couverture */}
          {discovery.featured_image_url && (
            <div className="relative h-72 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden mb-8 border border-gray-150 shadow-md">
              <Image
                src={discovery.featured_image_url}
                alt={discovery.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#E11A60] text-white shadow-md flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Découverte
                </span>
              </div>
            </div>
          )}

          {/* Méta-données Date & Lieu */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            {discovery.discovery_date && (
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200">
                <Calendar size={14} className="text-[#014F43]" />
                <span>
                  {new Date(discovery.discovery_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}

            {discovery.location && (
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200">
                <MapPin size={14} className="text-[#E11A60]" />
                <span>{discovery.location}</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#014F43] tracking-tight leading-tight mb-6">
            {discovery.title}
          </h1>

          {/* Résumé d'introduction */}
          {discovery.description && (
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border-l-4 border-[#E11A60] shadow-xs mb-8 text-base md:text-lg text-gray-700 italic leading-relaxed">
              « {discovery.description} »
            </div>
          )}

          {/* Contenu complet */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-150 prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {discovery.content ? (
              <SafeHtmlRenderer html={discovery.content} />
            ) : (
              <p className="text-gray-500 italic">Aucun compte-rendu supplémentaire disponible pour cette découverte.</p>
            )}
          </div>

          {/* Pied d'article avec bouton retour */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <Link
              href="/decouvertes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              <ArrowLeft size={16} />
              <span>Voir les autres découvertes</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
