export default function HeroLabels() {
  const labels = [
    { color: 'bg-[#E11A60]', text: 'RÉUNIONS STATUTAIRES' },
    { color: 'bg-[#014F43]', text: 'ACTIONS SOCIALES' },
    { color: 'bg-[#E11A60]', text: 'LEADERSHIP & AMITIÉ' },
  ]

  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-6 py-6 overflow-hidden">
      <div className="border-t border-gray-300/30 py-8">
        {/* Desktop */}
        <div className="hidden md:flex justify-between gap-8">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className={`w-3 h-3 ${label.color} rounded-full`}></span>
              <span className="text-sm uppercase tracking-widest text-gray-600 font-bold">
                {label.text}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Auto Marquee Scroll (Défilement automatique infini fluide) */}
        <div className="md:hidden overflow-hidden w-full relative py-1 flex">
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {/* Première série de labels */}
            {labels.map((label, index) => (
              <div
                key={`l1-${index}`}
                className="flex items-center gap-2 bg-gray-100/90 border border-gray-200/50 px-4 py-2.5 rounded-full whitespace-nowrap shadow-sm"
              >
                <span className={`w-2 h-2 ${label.color} rounded-full`}></span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-600">
                  {label.text}
                </span>
              </div>
            ))}
            {/* Deuxième série de labels (duplication pour effet infini parfait) */}
            {labels.map((label, index) => (
              <div
                key={`l2-${index}`}
                className="flex items-center gap-2 bg-gray-100/90 border border-gray-200/50 px-4 py-2.5 rounded-full whitespace-nowrap shadow-sm"
              >
                <span className={`w-2 h-2 ${label.color} rounded-full`}></span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-600">
                  {label.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
