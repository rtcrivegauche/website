export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'
import ItemGalleryViewer from '@/components/public/ItemGalleryViewer'
import { Calendar, MapPin, ArrowLeft, Clock, Users, UserCheck, Banknote, Tag, Sparkles } from 'lucide-react'

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
    discovery_time: '08h00 - 17h30',
    location: 'Ouidah, Bénin',
    location_address: 'Esplanade du Stade Général Mathieu Kérékou (Rassemblement)',
    activity_type: 'Immersion Culturelle & Historique',
    organizer_name: 'Commission Activités Extérieures',
    participants_count: 25,
    fee: 'Gratuit pour les membres',
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
    discovery_time: '09h00 - 15h00',
    location: 'Ganvié, Lac Nokoué',
    location_address: 'Embarcadère d\'Abomey-Calavi',
    activity_type: 'Excursion Écologique',
    organizer_name: 'Commission Environnement',
    participants_count: 20,
    fee: '3 000 FCFA',
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
    discovery_time: '10h00 - 13h00',
    location: 'Port Autonome de Cotonou',
    location_address: 'Direction Générale PAC, Boulevard de la Marina',
    activity_type: 'Visite Professionnelle',
    organizer_name: 'Commission Développement Professionnel',
    participants_count: 15,
    fee: 'Gratuit',
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
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#014F43] uppercase tracking-wider mb-6 transition-colors"
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
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#E11A60] text-white shadow-md flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Découverte & Immersion
                </span>

                {discovery.activity_type && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white shadow-md">
                    {discovery.activity_type}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Titre */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#014F43] tracking-tight leading-tight mb-6">
            {discovery.title}
          </h1>

          {/* Fiches d'informations pratiques (Date, Heure, Lieu, Tarif, etc.) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {discovery.discovery_date && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <Calendar size={13} className="text-[#014F43]" />
                  <span>Date</span>
                </div>
                <p className="text-sm sm:text-base font-black text-gray-900">
                  {new Date(discovery.discovery_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {discovery.discovery_time && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <Clock size={13} className="text-[#014F43]" />
                  <span>Horaires</span>
                </div>
                <p className="text-sm sm:text-base font-black text-[#014F43]">
                  {discovery.discovery_time}
                </p>
              </div>
            )}

            {discovery.location && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <MapPin size={13} className="text-[#E11A60]" />
                  <span>Lieu</span>
                </div>
                <p className="text-sm sm:text-base font-black text-gray-900 truncate">
                  {discovery.location}
                </p>
              </div>
            )}

            {discovery.fee && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <Banknote size={13} className="text-emerald-600" />
                  <span>Tarif / Coût</span>
                </div>
                <p className="text-sm sm:text-base font-black text-emerald-700 truncate">
                  {discovery.fee}
                </p>
              </div>
            )}

            {discovery.participants_count && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <Users size={13} className="text-blue-600" />
                  <span>Participants</span>
                </div>
                <p className="text-sm sm:text-base font-black text-gray-900">
                  {discovery.participants_count} inscrits
                </p>
              </div>
            )}

            {discovery.organizer_name && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-1">
                  <UserCheck size={13} className="text-purple-600" />
                  <span>Organisateur / Responsable</span>
                </div>
                <p className="text-sm sm:text-base font-black text-gray-900 truncate">
                  {discovery.organizer_name}
                </p>
              </div>
            )}
          </div>

          {/* Point de rassemblement précis si disponible */}
          {discovery.location_address && (
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-gray-200 mb-8 flex items-start gap-3 text-sm text-gray-700">
              <span className="p-2 bg-[#E11A60]/10 text-[#E11A60] rounded-xl flex-shrink-0">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Point de rendez-vous & Adresse exacte</p>
                <p className="font-semibold text-gray-900 mt-0.5">{discovery.location_address}</p>
              </div>
            </div>
          )}

          {/* Résumé d'introduction */}
          {discovery.description && (
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border-l-4 border-[#E11A60] shadow-xs mb-8 text-base md:text-lg text-gray-700 italic leading-relaxed">
              « {discovery.description} »
            </div>
          )}

          {/* Contenu complet */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-150 prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8">
            {discovery.content ? (
              <SafeHtmlRenderer html={discovery.content} />
            ) : (
              <p className="text-gray-500 italic">Aucun compte-rendu supplémentaire disponible pour cette découverte.</p>
            )}
          </div>

          {/* Galerie photos & souvenirs */}
          <ItemGalleryViewer
            images={discovery.gallery_images}
            title="Galerie Photos & Souvenirs de l'Immersion"
            subtitle="Explorez l'album photo de cette belle journée de découverte."
          />

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
