'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Quote } from 'lucide-react'

type President = {
  id: string
  full_name: string
  term: string
  photo_url: string | null
  message: string
  is_current: boolean
}

export default function PresidentWord() {
  const [president, setPresident] = useState<President | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentPresident = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('presidents')
          .select('*')
          .eq('is_current', true)
          .maybeSingle()

        if (error) throw error
        setPresident(data)
      } catch (err) {
        console.error('Error fetching current president:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentPresident()
  }, [])

  if (loading || !president) {
    return null // Ne rien afficher si en cours de chargement ou s'il n'y a pas de président configuré
  }

  return (
    <section className="w-full py-20 px-6 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center relative">
          
          {/* Décoration d'arrière-plan */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11A60]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#014F43]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          {/* Colonne Gauche : Photo */}
          <div className="w-full lg:w-5/12 flex flex-col items-center flex-shrink-0">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-[32px] overflow-hidden border-4 border-[#014F43]/10 shadow-lg group">
              {president.photo_url ? (
                <Image
                  src={president.photo_url}
                  alt={president.full_name}
                  fill
                  sizes="(max-w-768px) 288px, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-[#014F43]/5 flex items-center justify-center text-[#014F43] text-7xl font-black uppercase">
                  {president.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center mt-6">
              <h3 className="text-xl md:text-2xl font-black text-[#014F43] leading-tight">
                {president.full_name}
              </h3>
              <p className="text-[#E11A60] font-bold text-xs uppercase tracking-widest mt-1">
                Président du Mandat
              </p>
              <span className="inline-block mt-2 px-4 py-1.5 bg-[#014F43] text-white text-xs font-black rounded-full shadow-sm">
                {president.term}
              </span>
            </div>
          </div>

          {/* Colonne Droite : Message */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center relative">
            <Quote className="text-[#E11A60]/10 w-24 h-24 lg:w-32 lg:h-32 absolute -top-8 -left-6 lg:-top-16 lg:-left-12 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[#E11A60] font-black text-lg tracking-wider uppercase block mb-3">
                Le Mot du Président
              </span>
              
              <div className="text-gray-600 text-base md:text-lg leading-relaxed font-medium italic space-y-4">
                {president.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="relative">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#E11A60] rounded-full"></span>
                <span className="text-xs font-extrabold text-[#014F43] uppercase tracking-wider">
                  Club Rotaract de Cotonou Rive Gauche Cica
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
