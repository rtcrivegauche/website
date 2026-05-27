import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getFeaturedActions } from '@/lib/actions/home'

export default async function ActionsSection() {
  const actions = await getFeaturedActions()

  if (!actions || actions.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-12 md:py-16">
      <div className="flex justify-between items-end mb-8 px-6">
        <h2 className="text-2xl md:text-4xl font-black text-[#014F43] max-w-xs md:max-w-md tracking-tight leading-tight">
          Nos axes de service prioritaires
        </h2>
        <Link 
          href="/actions" 
          className="text-[#014F43] hover:text-[#E11A60] transition-colors flex items-center gap-1.5 mb-1 md:mb-2 flex-shrink-0"
          aria-label="Voir toutes les actions"
        >
          <span className="text-xs font-bold uppercase tracking-wider hidden md:inline underline underline-offset-4">
            VOIR TOUTES LES ACTIONS
          </span>
          <span className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 md:hidden transition-colors">
            <ChevronRight size={18} />
          </span>
        </Link>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6 px-6">
        {actions.map((action) => (
          <ActionCard 
            key={action.id} 
            category={action.category} 
            title={action.title} 
            image={action.featured_image_url} 
            slug={action.slug} 
          />
        ))}
      </div>

      {/* Mobile/Tablet Carousel */}
      <div className="lg:hidden actions-carousel px-6">
        {actions.map((action) => (
          <ActionCard 
            key={action.id} 
            category={action.category} 
            title={action.title} 
            image={action.featured_image_url} 
            slug={action.slug} 
          />
        ))}
      </div>
    </section>
  )
}

function ActionCard({ category, title, image, slug }: { category: string; title: string; image: string | null; slug: string }) {
  return (
    <Link 
      href={`/actions/${slug}`} 
      className="action-card group relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[3/4] cursor-pointer block shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-[#014F43]/10 flex items-center justify-center text-4xl">🌱</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#014F43]/90 via-[#014F43]/40 to-transparent flex flex-col justify-end p-6 md:p-8">
        <span className="bg-[#E11A60] text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
          {category}
        </span>
        <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#E11A60] transition-colors leading-tight">
          {title}
        </h4>
      </div>
    </Link>
  )
}
