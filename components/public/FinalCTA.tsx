'use client'

import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
      <div className="bg-gradient-to-br from-[#014F43] to-[#00362d] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11A60]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
            Rejoignez-nous dans notre mission
          </h2>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Ensemble, créons un impact durable et construisons un avenir meilleur pour notre communauté au Bénin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-donation-modal'))
                }
              }}
              className="w-full sm:w-auto px-9 py-4 bg-[#E11A60] hover:bg-[#c01550] text-white rounded-full font-black text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center cursor-pointer"
            >
              FAIRE UN DON ❤️
            </button>
            <Link
              href="/p/rejoindre-le-club"
              className="w-full sm:w-auto px-9 py-4 bg-white text-[#014F43] hover:bg-gray-100 rounded-full font-black text-sm tracking-wide hover:scale-105 transition-all shadow-lg text-center"
            >
              DEVENIR MEMBRE
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-9 py-4 border-2 border-white/80 text-white rounded-full font-black text-sm tracking-wide hover:bg-white/10 transition-all text-center"
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
