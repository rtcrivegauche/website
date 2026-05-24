import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedGallery } from '@/lib/actions/home'

export default async function GalleryPreview() {
  const images = await getFeaturedGallery()
  
  if (!images || images.length === 0) return null

  // Adapter les spans en fonction du nombre d'images disponibles (max 4 ou 6)
  const spans = [
    'md:col-span-2 md:row-span-2', // Image 1 (Grande)
    'md:col-span-1 md:row-span-1', // Image 2 (Petite)
    'md:col-span-1 md:row-span-1', // Image 3 (Petite)
    'md:col-span-2 md:row-span-1', // Image 4 (Moyenne horizontale)
    'md:col-span-1 md:row-span-1', // Image 5 (Petite)
    'md:col-span-1 md:row-span-1'  // Image 6 (Petite)
  ]

  return (
    <section className="max-w-[1320px] mx-auto py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 px-6 gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#014F43] text-center md:text-left">
          Vivre le Rotaract Cica
        </h2>
        <Link 
          href="/galerie" 
          className="px-6 py-2.5 border border-[#014F43] text-[#014F43] text-xs font-bold rounded-full hover:bg-[#014F43] hover:text-white transition-all duration-300 shadow-sm"
        >
          VOIR TOUTE LA GALERIE
        </Link>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 gap-4 h-[600px] px-6">
        {images.slice(0, 6).map((image, index) => (
          <Link 
            href="/galerie" 
            key={image.id} 
            className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer ${spans[index] || ''}`}
          >
            <div className="relative w-full h-full group">
              <Image
                src={image.media_url}
                alt={image.title || 'Galerie'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <span className="text-white text-xs font-bold uppercase tracking-wider bg-[#E11A60] px-4 py-2 rounded-full">
                  Agrandir
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden gallery-carousel pl-6">
        {images.map((image) => (
          <Link 
            href="/galerie" 
            key={image.id} 
            className="gallery-item rounded-2xl overflow-hidden shadow-md cursor-pointer block"
          >
            <div className="relative w-[300px] h-[320px]">
              <Image
                src={image.media_url}
                alt={image.title || 'Galerie'}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
