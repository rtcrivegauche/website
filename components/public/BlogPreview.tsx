import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedPosts } from '@/lib/actions/home'

export default async function BlogPreview() {
  const posts = await getFeaturedPosts()

  if (!posts || posts.length === 0) return null

  return (
    <section className="max-w-[1320px] mx-auto py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-[#014F43] mb-12 px-6">
        Actualités & Réflexions
      </h2>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6 px-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="lg:hidden news-carousel pl-6">
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
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="news-card flex flex-col group cursor-pointer h-full border border-gray-200/60 p-4 rounded-2xl md:rounded-3xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {post.featured_image_url ? (
        <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden mb-4">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center text-3xl">
          📰
        </div>
      )}
      {post.category && (
        <span className="bg-[#E11A60] text-white px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-3 uppercase tracking-wide">
          {post.category}
        </span>
      )}
      <h4 className="text-base md:text-lg font-bold text-[#014F43] mb-2 line-clamp-2 group-hover:text-[#E11A60] transition-colors leading-tight">
        {post.title}
      </h4>
      {post.excerpt && (
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {post.excerpt}
        </p>
      )}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
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
