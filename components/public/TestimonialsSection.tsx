'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Quote, Star, Video, ArrowLeft, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Testimonial {
  id: string | number
  name: string
  role: string
  promotion: string | null
  quote: string
  avatar_url: string | null
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Aurèle",
    role: "Past-Président",
    promotion: "Promotion 2023-2024",
    quote: "Le Rotaract a totalement redéfini ma vision du leadership. Au-delà des actions de service que nous menons, c'est une école de vie formidable et une famille soudée où chaque membre trouve sa place pour grandir et inspirer.",
    avatar_url: null
  },
  {
    id: 2,
    name: "Inès",
    role: "Secrétaire Générale",
    promotion: "Promotion 2024-2025",
    quote: "S'engager au Rotaract Cica, c'est l'opportunité d'agir concrètement pour notre communauté tout en développant des compétences professionnelles précieuses. Chaque projet mené est une victoire humaine collective.",
    avatar_url: null
  },
  {
    id: 3,
    name: "Marc",
    role: "Responsable Commission Action",
    promotion: "Promotion 2024-2025",
    quote: "Ce qui me marque le plus au sein du club, c'est l'alchimie unique entre la camaraderie sincère et le professionnalisme de nos réalisations. Servir d'abord n'est pas qu'une devise, c'est notre moteur quotidien.",
    avatar_url: null
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setTestimonials(data)
        }
      } catch (e) {
        console.error('Erreur lors du chargement des témoignages:', e)
      }
    }
    loadTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section className="max-w-[1320px] mx-auto py-16 md:py-24 px-6 bg-gradient-to-br from-[#014F43]/5 to-[#00362d]/5 rounded-[40px] my-16 border border-[#014F43]/10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Espace Vidéo (Témoignage Invité) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 text-[#E11A60] font-bold text-xs uppercase tracking-widest">
            <Video size={16} />
            <span>Témoignages en images</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-[#014F43] tracking-tight leading-tight">
            Ils témoignent de leur expérience avec nous
          </h2>
          
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Découvrez en vidéo le regard de nos invités, partenaires et bénéficiaires sur l&apos;impact concret de nos actions humanitaires et la force de notre réseau.
          </p>

          {/* Iframe vidéo réactive premium */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-gray-900 group">
            {/* Remplacement simple par une vidéo YouTube ou Vimeo du District ou Rotaract */}
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Lien fictif propre ou réel si configuré
              title="Témoignages invités Rotaract"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Carousel de Témoignages des Membres */}
        <div className="bg-white rounded-3xl border border-gray-150 p-8 md:p-12 shadow-sm flex flex-col justify-between h-full min-h-[400px] relative">
          
          {/* Icône de citation géante décorative */}
          <Quote className="absolute right-8 top-8 text-gray-100 w-28 h-28 -z-0 pointer-events-none" />

          <div className="relative z-10 flex-grow flex flex-col justify-center">
            {/* Citation */}
            <p className="text-gray-700 italic text-base md:text-xl leading-relaxed mb-8">
              « {testimonials[activeIndex].quote} »
            </p>

            {/* Auteur */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full border-2 border-[#E11A60] overflow-hidden bg-gray-50 flex items-center justify-center font-black text-[#E11A60] text-lg uppercase flex-shrink-0">
                {testimonials[activeIndex].avatar_url ? (
                  <Image src={testimonials[activeIndex].avatar_url} alt={testimonials[activeIndex].name} fill className="object-cover" />
                ) : (
                  testimonials[activeIndex].name.charAt(0)
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-[#014F43] text-base md:text-lg">
                  {testimonials[activeIndex].name}
                </h4>
                <p className="text-xs font-bold text-[#E11A60] uppercase tracking-wider">
                  {testimonials[activeIndex].role}
                </p>
                <p className="text-[10px] font-semibold text-gray-400">
                  {testimonials[activeIndex].promotion}
                </p>
              </div>
            </div>
          </div>

          {/* Boutons de navigation du Carousel */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 relative z-10 flex-shrink-0">
            {/* Indicateurs de progression */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-6 bg-[#E11A60]' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                ></button>
              ))}
            </div>

            {/* Flèches */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-[#014F43] border border-gray-200 rounded-xl transition-all"
                title="Témoignage précédent"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-[#014F43] border border-gray-200 rounded-xl transition-all"
                title="Témoignage suivant"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
