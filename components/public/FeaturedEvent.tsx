import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedEvent } from '@/lib/actions/home'

export default async function FeaturedEvent() {
  const event = await getFeaturedEvent()
  
  if (!event) return null
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
      <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row border border-gray-200/80 hover:shadow-2xl transition-all duration-300">
        {/* Content */}
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-center">
          <span className="bg-[#E11A60] text-white px-3 py-1 md:px-4 md:py-1 rounded-full text-[11px] md:text-sm font-bold uppercase tracking-wide w-fit mb-4 md:mb-6">
            PROCHAIN ÉVÉNEMENT
          </span>
          
          <h3 className="text-[28px] md:text-5xl font-bold text-[#014F43] mb-3 md:mb-4 leading-tight">
            {event.title}
          </h3>
          
          {event.description && (
            <p className="text-[15px] md:text-xl text-gray-600 mb-6 md:mb-8 italic opacity-90 leading-relaxed max-w-2xl">
              {event.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 md:gap-6 mb-6">
            <div className="bg-[#014F43] p-4 md:p-5 rounded-2xl text-center min-w-[90px] md:min-w-[110px] shadow-sm">
              <span className="block text-[32px] md:text-5xl font-bold text-white leading-none">
                {new Date(event.event_date).getDate()}
              </span>
              <span className="text-[11px] md:text-xs text-white/90 uppercase tracking-widest font-bold mt-1 block">
                {new Date(event.event_date).toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
            </div>
            <div>
              <p className="text-[16px] md:text-xl font-bold text-[#014F43]">
                {new Date(event.event_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — {event.location}
              </p>
              <p className="text-[13px] md:text-base text-gray-600 mt-1">{event.location_address}</p>
            </div>
          </div>

          <Link 
            href={`/evenements/${event.slug}`}
            className="px-6 py-3 bg-[#E11A60] text-white text-sm font-bold rounded-full hover:bg-[#c01550] transition-colors w-fit shadow-md hover:shadow-lg text-center"
          >
            EN SAVOIR PLUS & S'INSCRIRE
          </Link>
        </div>

        {/* Speaker Image */}
        {event.speaker_photo_url && (
          <div className="md:w-1/3 relative overflow-hidden group h-64 md:h-auto">
            <Image
              src={event.speaker_photo_url}
              alt={event.speaker_name || 'Intervenant'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#014F43]/20 mix-blend-multiply group-hover:opacity-0 transition-opacity"></div>
            {event.speaker_name && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#014F43] p-4 md:p-6">
                <h4 className="text-[16px] md:text-xl font-bold text-white text-center">
                  {event.speaker_name}
                </h4>
                {event.speaker_title && (
                  <p className="text-[11px] md:text-xs text-white/70 text-center uppercase tracking-wider mt-0.5">
                    {event.speaker_title}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
