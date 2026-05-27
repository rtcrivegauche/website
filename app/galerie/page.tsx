import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { FolderHeart, Image as ImageIcon, Calendar } from 'lucide-react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export const metadata = {
  title: 'Photothèque Publique',
  description: 'Retrouvez et partagez toutes les photos des réunions statutaires, actions et événements du Rotaract Club de Cotonou Rive Gauche Cica.',
}

interface Album {
  category: string
  title: string
  thumbnailUrl: string
  photoCount: number
  date: string
}

export default async function GaleriePage() {
  const supabase = await createClient()

  // Récupérer tous les items de la galerie
  const { data: galleryItems } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  // Grouper dynamiquement les photos par catégorie (album)
  const albumsMap = new Map<string, any[]>()
  
  if (galleryItems) {
    galleryItems.forEach(item => {
      const category = item.category || 'Autres Événements'
      if (!albumsMap.has(category)) {
        albumsMap.set(category, [])
      }
      albumsMap.get(category)!.push(item)
    })
  }

  const albums: Album[] = []
  albumsMap.forEach((photos, category) => {
    // Trier les photos par date de création antéchronologique
    const sortedPhotos = [...photos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const latestPhoto = sortedPhotos[0]
    
    albums.push({
      category: category,
      title: category,
      thumbnailUrl: latestPhoto.media_url,
      photoCount: photos.length,
      date: new Date(latestPhoto.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    })
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
          <div className="max-w-[1320px] mx-auto px-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <FolderHeart size={36} className="text-[#E11A60]" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Photothèque Publique</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Retrouvez et partagez les souvenirs de nos réunions, nos actions de service et nos moments de camaraderie.
            </p>
          </div>
        </section>

        {/* Liste des albums */}
        <section className="max-w-[1320px] mx-auto px-6 py-16">
          {albums.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-150 p-16 text-center shadow-sm max-w-2xl mx-auto">
              <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun album disponible</h3>
              <p className="text-gray-500">Revenez très bientôt pour découvrir nos premières photos de la photothèque publique !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <Link
                  key={album.category}
                  href={`/galerie/${encodeURIComponent(album.category)}`}
                  className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                >
                  {/* Image de couverture */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image
                      src={album.thumbnailUrl}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1">
                      <ImageIcon size={12} />
                      {album.photoCount} {album.photoCount > 1 ? 'photos' : 'photo'}
                    </div>
                  </div>

                  {/* Infos de l'album */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors duration-300 line-clamp-2 leading-tight">
                        {album.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-4 border-t border-gray-100 pt-4">
                      <Calendar size={14} className="text-[#E11A60]" />
                      <span>Mis à jour le {album.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
