import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function GalleryPreview() {
  const supabase = await createClient()
  
  const { data: members } = await supabase
    .from('members')
    .select('id, full_name, position, photo_url, slug')
    .eq('is_active', true)
    .order('display_order')
    .limit(8)
  
  if (!members || members.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-16 md:py-24">
      <div className="flex justify-between items-end mb-12 px-6">
        <div className="text-left max-w-xs md:max-w-2xl">
          <h2 className="text-2xl md:text-5xl font-black text-[#014F43] leading-tight tracking-tight mb-3">
            Nos membres sont notre plus grande force
          </h2>
          <p className="text-gray-600 text-xs md:text-base">
            Découvrez l&apos;équipe de jeunes leaders passionnés et engagés qui font vivre notre club au quotidien.
          </p>
        </div>
        <Link 
          href="/membres" 
          className="text-[#014F43] hover:text-[#E11A60] transition-colors flex items-center gap-1.5 mb-1 md:mb-2 flex-shrink-0"
          aria-label="Découvrir tous nos membres"
        >
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline underline underline-offset-4">
            DÉCOUVRIR TOUS NOS MEMBRES
          </span>
          <span className="p-2.5 bg-gray-55 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 md:hidden transition-colors">
            <ChevronRight size={18} />
          </span>
        </Link>
      </div>

      {/* Trombinoscope Mosaïque Premium (Grand écran) */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {members.map((member) => (
          <Link 
            href={`/membres/${member.slug}`} 
            key={member.id}
            className="group relative bg-white border border-gray-150 rounded-3xl p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#014F43]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full border-4 border-[#014F43]/10 group-hover:border-[#E11A60]/35 transition-all duration-300 overflow-hidden shadow-inner bg-gray-50">
              {member.photo_url ? (
                <Image
                  src={member.photo_url}
                  alt={member.full_name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl uppercase">
                  {member.full_name.charAt(0)}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-gray-950 text-base md:text-lg group-hover:text-[#E11A60] transition-colors duration-300 truncate">
                {member.full_name}
              </h3>
              <p className="text-xs uppercase tracking-widest font-semibold text-[#014F43]/70 group-hover:text-[#014F43] transition-colors duration-300 truncate mt-1">
                {member.position || 'Rotaractien'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Trombinoscope Mobile Carousel (Petit écran) */}
      <div className="md:hidden members-carousel px-6">
        {members.map((member) => (
          <Link 
            href={`/membres/${member.slug}`} 
            key={member.id}
            className="member-card relative bg-white border border-gray-150 rounded-3xl p-5 text-center shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#014F43]/5 rounded-full"></div>
            
            <div>
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full border-4 border-[#014F43]/10 overflow-hidden shadow-inner bg-gray-50">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.full_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-lg uppercase">
                    {member.full_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="font-bold text-gray-955 text-base truncate">
                  {member.full_name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#014F43]/70 truncate mt-1">
                  {member.position || 'Rotaractien'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
