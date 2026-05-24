import { createClient } from '@/lib/supabase/server'
import HomeFeaturedManager from '@/components/admin/HomeFeaturedManager'

export default async function AdminHomePage() {
  const supabase = await createClient()
  
  // Récupérer tous les contenus disponibles
  const [
    { data: events },
    { data: actions },
    { data: members },
    { data: gallery },
    { data: posts },
    { data: featured }
  ] = await Promise.all([
    supabase.from('events').select('id, title, event_date, is_published').eq('is_published', true).order('event_date', { ascending: false }),
    supabase.from('actions').select('id, title, category, is_published').eq('is_published', true).order('created_at', { ascending: false }),
    supabase.from('members').select('id, full_name, role_title, is_active').eq('is_active', true).order('full_name'),
    supabase.from('gallery_items').select('id, title, media_url, is_active').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('blog_posts').select('id, title, published_at, is_published').eq('is_published', true).order('published_at', { ascending: false }),
    supabase.from('home_featured_items').select('*').order('section_key').order('order_index')
  ])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuration de la page d&apos;accueil</h1>
        <p className="text-gray-600 mt-2">
          Choisissez les contenus à mettre en avant sur la page d&apos;accueil
        </p>
      </div>

      <HomeFeaturedManager
        events={events || []}
        actions={actions || []}
        members={members || []}
        gallery={gallery || []}
        posts={posts || []}
        featured={featured || []}
      />
    </div>
  )
}
