export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'
import { stripHtml } from '@/lib/utils'

export default async function ActionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: action } = await supabase
    .from('actions')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!action) {
    notFound()
  }

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <article className="max-w-4xl mx-auto px-6">
          {action.featured_image_url && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={action.featured_image_url}
                alt={action.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <span className="bg-[#22C83A] text-white px-4 py-2 rounded-full text-sm font-bold">
              {action.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#014F43] mb-6">
            {action.title}
          </h1>

          {action.description && (
            <p className="text-xl text-gray-600 mb-8">
              {stripHtml(action.description)}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {action.start_date && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Début</p>
                <p className="text-lg font-bold text-[#014F43]">
                  {new Date(action.start_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            {action.end_date && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Fin</p>
                <p className="text-lg font-bold text-[#014F43]">
                  {new Date(action.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            {action.location && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Lieu</p>
                <p className="text-lg font-bold text-[#014F43]">{action.location}</p>
              </div>
            )}
            {action.beneficiaries_count && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Bénéficiaires</p>
                <p className="text-lg font-bold text-[#014F43]">{action.beneficiaries_count}</p>
              </div>
            )}
          </div>

          {action.content && (
            <div className="prose prose-lg max-w-none bg-white p-8 rounded-xl">
              <SafeHtmlRenderer html={action.content} />
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}
