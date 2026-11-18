export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'
import { stripHtml } from '@/lib/utils'
import ItemGalleryViewer from '@/components/public/ItemGalleryViewer'
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react'

export default async function ActionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: action } = await supabase
    .from('actions')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!action) {
    notFound()
  }

  return (
    <div className="min-h-screen low-poly-bg flex flex-col justify-between">
      <Header />
      <main className="mt-24 py-16">
        <article className="max-w-4xl mx-auto px-6">
          {/* Bouton retour */}
          <Link
            href="/actions"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#014F43] uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Toutes les actions</span>
          </Link>

          {action.featured_image_url && (
            <div className="relative h-72 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden mb-8 border border-gray-150 shadow-md">
              <Image
                src={action.featured_image_url}
                alt={action.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="bg-[#22C83A] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
              {action.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#014F43] tracking-tight leading-tight mb-6">
            {action.title}
          </h1>

          {action.description && (
            <div className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border-l-4 border-[#22C83A] shadow-xs mb-8 text-base md:text-lg text-gray-700 italic leading-relaxed">
              « {stripHtml(action.description)} »
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {action.start_date && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Début</p>
                <p className="text-base font-black text-[#014F43] mt-1">
                  {new Date(action.start_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            {action.end_date && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Fin</p>
                <p className="text-base font-black text-[#014F43] mt-1">
                  {new Date(action.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            {action.location && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Lieu</p>
                <p className="text-base font-black text-[#014F43] mt-1 truncate">{action.location}</p>
              </div>
            )}
            {action.beneficiaries_count && (
              <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs text-center">
                <p className="text-xs font-bold text-gray-400 uppercase">Bénéficiaires</p>
                <p className="text-base font-black text-[#22C83A] mt-1">{action.beneficiaries_count}</p>
              </div>
            )}
          </div>

          {action.content && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-150 prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8">
              <SafeHtmlRenderer html={action.content} />
            </div>
          )}

          {/* Galerie photos & souvenirs */}
          <ItemGalleryViewer
            images={action.gallery_images}
            title="Album Photos de l'Action"
            subtitle="Découvrez les clichés des équipes sur le terrain et l'impact de ce projet."
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/actions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              <ArrowLeft size={16} />
              <span>Voir les autres actions</span>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
