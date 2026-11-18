import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import BlogPostsList from '@/components/public/BlogPostsList'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#014F43] mb-4">
              Blog & Actualités
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Découvrez nos réflexions, témoignages, bilans d&apos;actions et actualités
            </p>
          </div>

          <BlogPostsList posts={posts || []} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
