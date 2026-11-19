import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'
import EmbedCodeRenderer from '@/components/ui/EmbedCodeRenderer'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: page } = await supabase
    .from('custom_pages')
    .select('title, meta_title, meta_description, og_image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!page) {
    return {
      title: 'Page non trouvée',
    }
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || undefined,
      images: page.og_image_url ? [page.og_image_url] : undefined,
    },
  }
}

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: page, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !page) {
    notFound()
  }

  // Si c'est un embed code (Tally, etc.), on l'affiche avec Header et Footer
  if (page.content_type === 'embed' && page.embed_code) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <main className="flex-grow mt-24 py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-150">
            <h1 className="text-3xl sm:text-4xl font-black text-[#014F43] mb-2 text-center">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-sm sm:text-base text-gray-500 mb-6 text-center max-w-2xl mx-auto">
                {page.description}
              </p>
            )}
            <EmbedCodeRenderer code={page.embed_code} />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Si c'est du contenu riche ou hybride
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-[#014F43] mb-4">
            {page.title}
          </h1>
          
          {page.description && (
            <p className="text-xl text-gray-600 mb-8">
              {page.description}
            </p>
          )}

          {/* Contenu riche rendu de manière sécurisée */}
          {page.rich_content?.html && (
            <div className="prose prose-lg max-w-none">
              <SafeHtmlRenderer html={page.rich_content.html} />
            </div>
          )}

          {/* Embed code en mode hybride */}
          {page.content_type === 'hybrid' && page.embed_code && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <EmbedCodeRenderer code={page.embed_code} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
