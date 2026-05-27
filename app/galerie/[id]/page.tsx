import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FolderHeart, Calendar } from 'lucide-react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AlbumViewer from '@/components/public/AlbumViewer'
import type { Metadata } from 'next'

interface AlbumPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params
  const albumName = decodeURIComponent(id)
  
  return {
    title: `${albumName} - Photothèque Publique`,
    description: `Découvrez toutes les photos de l'album "${albumName}" du Rotaract Club de Cotonou Rive Gauche Cica.`,
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params
  const albumName = decodeURIComponent(id)
  const supabase = await createClient()

  // Récupérer toutes les photos de cet album (filtrer par category)
  const { data: photos } = await supabase
    .from('gallery')
    .select('*')
    .eq('category', albumName)
    .order('created_at', { ascending: false })

  if (!photos || photos.length === 0) {
    notFound()
  }

  const latestPhoto = photos[0]
  const dateFormatted = new Date(latestPhoto.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* En-tête de l'album */}
        <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-12 md:py-16">
          <div className="max-w-[1320px] mx-auto px-6">
            {/* Bouton retour */}
            <Link 
              href="/galerie"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold uppercase tracking-wider text-white/80 hover:text-white mb-6 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-colors"
            >
              <ChevronLeft size={16} /> Retour aux albums
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/10 pt-6">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-[#E11A60] font-bold text-xs uppercase tracking-widest mb-2">
                  <FolderHeart size={14} /> Album Photo
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                  {albumName}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-white/80 bg-white/10 px-4 py-2.5 rounded-full backdrop-blur-md w-fit flex-shrink-0">
                <Calendar size={14} className="text-[#E11A60]" />
                <span>Mis à jour le {dateFormatted}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visionneuse de photos */}
        <section className="max-w-[1320px] mx-auto px-6 py-16">
          <AlbumViewer photos={photos} title={albumName} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
