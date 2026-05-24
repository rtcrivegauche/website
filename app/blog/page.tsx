import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#014F43] mb-4">
            Blog & Actualités
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez nos réflexions, témoignages et actualités
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {post.featured_image_url && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="bg-[#22C83A] text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-[#014F43] mb-3 group-hover:text-[#22C83A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <p className="text-sm text-gray-500">
                      {new Date(post.published_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
