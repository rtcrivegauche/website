import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) {
    notFound()
  }

  await supabase
    .from('blog_posts')
    .update({ views_count: (post.views_count || 0) + 1 })
    .eq('id', post.id)

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <article className="max-w-4xl mx-auto px-6">
          {post.featured_image_url && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            {post.category && (
              <span className="bg-[#22C83A] text-white px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block">
                {post.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-[#014F43] mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
              {post.published_at && (
                <span>
                  {new Date(post.published_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {post.reading_time && (
                <>
                  <span>•</span>
                  <span>{post.reading_time} min de lecture</span>
                </>
              )}
              {post.views_count > 0 && (
                <>
                  <span>•</span>
                  <span>{post.views_count} vues</span>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <p className="text-sm text-gray-600 mb-3">Tags :</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
