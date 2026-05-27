import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedPosts } from '@/lib/actions/home'

export default async function BlogPreview() {
  const posts = await getFeaturedPosts()

  if (!posts || posts.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-16 md:py-24">
      <div className="flex flex-col items-center md:items-start mb-12 px-6">
        <h2 className="text-3xl md:text-5xl font-black text-[#014F43] tracking-tight">
          Actualités
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-2">
          Suivez la vie de notre club, découvrez nos dernières réalisations et nos événements à venir.
        </p>
      </div>

      {/* Desktop Grid (Min 4 Cards) */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {posts.slice(0, 4).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Mobile/Tablet Carousel */}
      <div className="lg:hidden news-carousel px-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  category: string | null
  published_at: string | null
}

function BlogCard({ post }: { post: BlogPost }) {
  // Détermination intelligente du badge thématique
  const isAnnonce = post.category?.toLowerCase().includes('annonce')
  
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="news-card flex flex-col group cursor-pointer h-full border border-gray-150 p-4 rounded-3xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {post.featured_image_url ? (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center text-3xl">
          📰
        </div>
      )}

      {/* Badge thématique coloré distinctif */}
      {post.category ? (
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold w-fit mb-3 uppercase tracking-wider shadow-sm ${
          isAnnonce 
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
            : 'bg-gradient-to-r from-[#014F43] to-[#00362d] text-white'
        }`}>
          {post.category}
        </span>
      ) : (
        <span className="bg-gradient-to-r from-[#014F43] to-[#00362d] text-white px-3 py-1 rounded-full text-[10px] font-extrabold w-fit mb-3 uppercase tracking-wider shadow-sm">
          Actualité
        </span>
      )}

      <h4 className="text-base md:text-lg font-bold text-[#014F43] mb-2 line-clamp-2 group-hover:text-[#E11A60] transition-colors leading-tight">
        {post.title}
      </h4>
      {post.excerpt && (
        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {post.excerpt}
        </p>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
        <span>Rotaract Cica</span>
        {post.published_at && (
          <span>
            {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
    </Link>
  )
}
