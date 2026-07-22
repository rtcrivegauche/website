import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit2, Quote } from 'lucide-react'
import TestimonialVideoConfig from '@/components/admin/TestimonialVideoConfig'

export const metadata = {
  title: 'Gestion des Témoignages - Administration',
  description: 'Administrez les citations et témoignages dynamiques de la page d\'accueil.',
}

export default async function TestimonialsAdminPage() {
  const supabase = await createClient()

  // 1. Récupérer les témoignages
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
  }

  // 2. Récupérer la config vidéo YouTube
  const { data: configData } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'testimonials_video_url')
    .single()

  const videoUrl = configData?.value || ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Témoignages</h1>
          <p className="text-gray-500 mt-1">
            Gérez les citations et la vidéo YouTube des invités affichées sur la page d'accueil.
          </p>
        </div>
        <Link
          href="/admin/temoignages/nouveau"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Ajouter un témoignage
        </Link>
      </div>

      {/* Configuration de la vidéo YouTube d'invités */}
      <TestimonialVideoConfig initialVideoUrl={videoUrl} />

      {/* Liste des témoignages */}
      {!testimonials || testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-12 text-center max-w-2xl mx-auto">
          <div className="p-4 bg-gray-55 rounded-full w-fit mx-auto text-gray-400 mb-4">
            <Quote size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun témoignage enregistré</h3>
          <p className="text-gray-500 mb-6">
            Ajoutez de superbes citations de vos membres et de vos partenaires externes pour dynamiser votre page d'accueil.
          </p>
          <Link
            href="/admin/temoignages/nouveau"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all"
          >
            <Plus size={20} />
            Créer un témoignage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative ${
                !t.is_published ? 'border-dashed border-gray-300 opacity-70' : 'border-gray-150'
              }`}
            >
              {!t.is_published && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Brouillon
                </span>
              )}

              <div>
                <Quote className="text-gray-100 w-16 h-16 absolute -top-2 left-4 -z-0 pointer-events-none" />
                <p className="text-gray-600 italic text-sm leading-relaxed mb-6 mt-4 line-clamp-4 relative z-10">
                  « {t.quote} »
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center font-black text-[#014F43] text-sm uppercase flex-shrink-0">
                    {t.avatar_url ? (
                      <Image src={t.avatar_url} alt={t.name} fill className="object-cover" />
                    ) : (
                      t.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#014F43] text-sm leading-tight">{t.name}</h4>
                    <p className="text-[10px] font-bold text-[#E11A60] uppercase tracking-wider">{t.role}</p>
                    {t.promotion && <p className="text-[9px] text-gray-400 font-semibold">{t.promotion}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500" title="Ordre d'affichage">
                    #{t.display_order}
                  </span>
                  <Link
                    href={`/admin/temoignages/${t.id}`}
                    className="p-2 bg-gray-50 hover:bg-[#014F43] text-gray-500 hover:text-white rounded-xl transition-all border border-gray-200"
                    title="Modifier ce témoignage"
                  >
                    <Edit2 size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
