import Image from 'next/image'
import Link from 'next/link'
import { Award, Star } from 'lucide-react'
import { getFeaturedMembers } from '@/lib/actions/home'

export default async function FeaturedMembers() {
  const members = await getFeaturedMembers()

  if (!members || members.length === 0) return null

  // Raisons de distinction par défaut pour la démo si non configurées en BDD
  const defaultDistinctions = [
    "Pour son leadership exemplaire et son dévouement exceptionnel.",
    "Pour avoir payé ses cotisations avant tout le monde ce trimestre.",
    "Pour sa contribution majeure au succès de nos dernières actions sociales.",
    "Pour son esprit d'initiative et son mentorat envers les nouveaux membres.",
    "Pour son assiduité parfaite à toutes nos réunions statutaires.",
    "Pour sa gestion rigoureuse et son intégrité dans les finances du club."
  ]

  return (
    <section className="max-w-[1320px] mx-auto py-16 md:py-24 text-center overflow-hidden bg-gradient-to-b from-white to-gray-50/50 rounded-3xl my-12 border border-gray-100">
      <div className="flex flex-col items-center mb-12 px-6">
        <div className="w-12 h-12 bg-[#E11A60]/10 rounded-full flex items-center justify-center mb-4">
          <Award className="text-[#E11A60]" size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[#014F43] tracking-tight">
          Nos Membres à l&apos;Honneur
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-2 max-w-lg">
          Découvrez les visages de l&apos;excellence, distingués ce mois-ci pour leur engagement et leur impact hors du commun.
        </p>
      </div>

      {/* Desktop Grid (Grand écran) */}
      <div className="hidden lg:flex flex-wrap gap-8 justify-center items-stretch px-6">
        {members.map((member, index) => {
          const distinction = (member as any).distinction_reason || defaultDistinctions[index % defaultDistinctions.length]

          return (
            <Link
              key={member.id}
              href={`/membres/${member.slug}`}
              className="w-[280px] bg-white rounded-3xl border border-gray-150 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Photo de profil avec badge étoile de distinction */}
                <div className="relative w-36 h-36 mx-auto mb-5 rounded-full border-4 border-[#E11A60]/20 p-1 group-hover:scale-105 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#E11A60] rounded-full flex items-center justify-center text-white shadow z-10 animate-pulse">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-55">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl uppercase">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nom & Rôle */}
                <h3 className="text-xl font-extrabold text-[#014F43] group-hover:text-[#E11A60] transition-colors truncate">
                  {member.full_name}
                </h3>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mt-1 truncate">
                  {member.role_title || member.position || 'Rotaractien'}
                </p>
              </div>

              {/* Raison de la distinction */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="px-3 py-2 bg-pink-50/50 rounded-2xl">
                  <p className="text-xs italic text-gray-600 leading-relaxed">
                    « {distinction} »
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Mobile/Tablet Carousel (Petit écran) */}
      <div className="lg:hidden members-carousel px-6">
        {members.map((member, index) => {
          const distinction = (member as any).distinction_reason || defaultDistinctions[index % defaultDistinctions.length]

          return (
            <Link
              key={member.id}
              href={`/membres/${member.slug}`}
              className="member-card bg-white rounded-3xl border border-gray-150 p-5 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Photo de profil plus compacte sur mobile */}
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full border-4 border-[#E11A60]/20 p-1">
                  <div className="absolute top-0 right-0 w-7 h-7 bg-[#E11A60] rounded-full flex items-center justify-center text-white shadow z-10 animate-pulse">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-55">
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
                </div>

                {/* Nom & Rôle */}
                <h3 className="text-lg font-extrabold text-[#014F43] truncate">
                  {member.full_name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1 truncate">
                  {member.role_title || member.position || 'Rotaractien'}
                </p>
              </div>

              {/* Raison de la distinction */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="px-2 py-1.5 bg-pink-50/50 rounded-xl">
                  <p className="text-[10px] italic text-gray-500 leading-normal line-clamp-3">
                    « {distinction} »
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
