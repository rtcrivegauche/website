import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedMembers } from '@/lib/actions/home'

export default async function FeaturedMembers() {
  const members = await getFeaturedMembers()

  if (!members || members.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-12 md:py-16 text-center overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-[#014F43] mb-12 px-6">
        Nos Membres à l&apos;Honneur
      </h2>

      {/* Desktop */}
      <div className="hidden md:flex flex-nowrap gap-12 justify-center items-center px-6">
        {members.map((member, index) => {
          const isCentral = index === 2 || (members.length < 3 && index === Math.floor(members.length / 2))
          return (
            <Link
              key={member.id}
              href={`/membres/${member.slug}`}
              className={`flex-shrink-0 transition-all duration-300 cursor-pointer group text-center ${
                isCentral
                  ? 'w-72 scale-110 z-10'
                  : 'w-64 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-105'
              }`}
            >
              <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-4 transition-transform duration-300 group-hover:shadow-lg rounded-full">
                {member.photo_url && (
                  <Image
                    src={member.photo_url}
                    alt={member.full_name}
                    fill
                    className={`rounded-full object-cover transition-all duration-300 ${
                      isCentral ? 'border-4 border-[#E11A60] p-1' : 'border-4 border-transparent'
                    }`}
                  />
                )}
              </div>
              <p className="text-2xl font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors">{member.full_name}</p>
              <p
                className={`text-sm uppercase tracking-widest font-semibold mt-1 ${
                  isCentral ? 'text-[#E11A60]' : 'text-gray-600 group-hover:text-[#014F43]'
                }`}
              >
                {member.role_title || member.position || 'Membre'}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden members-carousel pl-6">
        {members.map((member, index) => {
          const isCentral = index === 2 || (members.length < 3 && index === Math.floor(members.length / 2))
          return (
            <Link
              key={member.id}
              href={`/membres/${member.slug}`}
              className={`member-card text-center cursor-pointer block ${
                isCentral ? '' : 'grayscale opacity-75'
              }`}
            >
              <div className={`relative ${isCentral ? 'w-48 h-48' : 'w-40 h-40'} mx-auto mb-3`}>
                {member.photo_url && (
                  <Image
                    src={member.photo_url}
                    alt={member.full_name}
                    fill
                    className={`rounded-full object-cover ${
                      isCentral ? 'border-4 border-[#E11A60] p-1' : 'border-4 border-transparent'
                    }`}
                  />
                )}
              </div>
              <p className={`font-bold text-[#014F43] ${isCentral ? 'text-[20px]' : 'text-[18px]'}`}>
                {member.full_name}
              </p>
              <p
                className={`text-[11px] uppercase tracking-wide font-semibold ${
                  isCentral ? 'text-[#E11A60] text-[12px]' : 'text-gray-600'
                }`}
              >
                {member.role_title || member.position || 'Membre'}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
