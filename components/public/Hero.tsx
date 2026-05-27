import Image from 'next/image'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/actions/site-config'

export default async function Hero() {
  const config = await getSiteConfig()
  
  // Valeurs par défaut si la config n'est pas disponible
  const heroImage = config?.hero_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBIULNbS7XfWej-OpF0Lhj0T6N2MwaCuyAbZBOxhKlgYzri86kTwHJCITDMg5OEs7JbGcl_TkLbmi1qvoVgkLQlvyBlnJA6SykVcR33zIHxuEDAoeYJJMcbHNquqxXoyq-cv3NZ0LeNu9S12ImN-E30CmRHG3u5fr7iXk7Nt2DSBw9zuh39eh_KIDqwD2XhfcRbshFs7I76W6rHr89QcNIIa0-dToUlkmupbTDI_zmF1UI7FQ7NRXufTWUd9XxaSQtJz4NARyH-5vs"
  const heroSubtitle = config?.hero_subtitle || "Au Club Rotaract de Cotonou Rive Gauche Cica, nous formons une nouvelle génération de leaders engagés pour un impact durable au Bénin à travers le service et l'amitié."
  const ctaPrimary = config?.hero_cta_primary || "REJOINDRE LE CLUB"
  const ctaSecondary = config?.hero_cta_secondary || "DÉCOUVRIR NOS ACTIONS"
  const ctaPrimaryUrl = config?.hero_cta_primary_url || "/membres"
  const ctaSecondaryUrl = config?.hero_cta_secondary_url || "/actions"

  return (
    <section className="min-h-[580px] md:min-h-[620px] flex items-center justify-center text-center px-6 pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="max-w-[1400px] mx-auto">
        {/* Desktop Hero */}
        <div className="hidden md:block">
          <h1 className="mb-12">
            <div className="hero-title-line1 text-[#014F43] mb-3 hero-animate-title">
              Servir{' '}
              <span className="image-capsule">
                <Image
                  src={heroImage}
                  alt="Jeunes leaders souriants"
                  width={260}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              </span>
              Inspirer
            </div>
            <div className="hero-title-line2 text-[#E11A60] hero-animate-subtitle">
              Grandir Ensemble.
            </div>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-[680px] mx-auto mb-12 leading-relaxed hero-animate-text">
            {heroSubtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center hero-animate-buttons">
            <Link href={ctaPrimaryUrl} className="px-10 py-5 bg-[#E11A60] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-[#c01550]">
              {ctaPrimary}
            </Link>
            <Link href={ctaSecondaryUrl} className="px-10 py-5 border-2 border-[#014F43] text-[#014F43] text-sm font-bold rounded-full hover:bg-[#014F43]/5 transition-all">
              {ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="md:hidden">
          <h1 className="mb-8">
            <div className="hero-title-line1 text-[#014F43] mb-4 hero-animate-title">
              Servir
            </div>
            
            <div className="hero-mobile-image hero-animate-title">
              <Image
                src={heroImage}
                alt="Jeunes leaders souriants"
                width={300}
                height={150}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            <div className="hero-title-line1 text-[#014F43] mb-4 hero-animate-subtitle">
              Inspirer
            </div>
            
            <div className="hero-title-line2 text-[#E11A60] hero-animate-subtitle">
              Grandir Ensemble.
            </div>
          </h1>
          
          <p className="text-[14px] leading-relaxed text-gray-600 max-w-[340px] mx-auto mb-8 hero-animate-text">
            {heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center hero-animate-buttons">
            <Link href={ctaPrimaryUrl} className="px-8 py-4 bg-[#E11A60] text-white text-[13px] font-bold rounded-full shadow-lg text-center hover:bg-[#c01550] transition-colors">
              {ctaPrimary}
            </Link>
            <Link href={ctaSecondaryUrl} className="px-8 py-4 border-2 border-[#014F43] text-[#014F43] text-[13px] font-bold rounded-full text-center hover:bg-[#014F43] hover:text-white transition-colors">
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
