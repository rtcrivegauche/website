import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default async function ActionsPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  return (
    <div className="min-h-screen low-poly-bg">
      <Header />
      <main className="mt-24 py-16">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#014F43] mb-4">
            Nos Actions & Projets
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez nos initiatives pour un impact positif dans la communauté
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actions?.map((action) => (
              <Link
                key={action.id}
                href={`/actions/${action.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {action.featured_image_url && (
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={action.featured_image_url}
                      alt={action.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#22C83A] text-white px-3 py-1 rounded-full text-xs font-bold">
                        {action.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#014F43] mb-3 group-hover:text-[#22C83A] transition-colors">
                    {action.title}
                  </h3>
                  {action.description && (
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {action.description}
                    </p>
                  )}
                  <div className="flex items-center text-[#014F43] font-medium">
                    En savoir plus →
                  </div>
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
