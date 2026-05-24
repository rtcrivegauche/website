export default function FinalCTA() {
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
      <div className="bg-gradient-to-br from-[#014F43] to-[#00362d] rounded-xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E11A60]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Rejoignez-nous dans notre mission
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Ensemble, créons un impact durable et construisons un avenir meilleur pour notre communauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-[#014F43] rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">
              DEVENIR MEMBRE
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              NOUS CONTACTER
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
