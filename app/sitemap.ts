import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rotaract-cica.com'

  const [
    { data: actions },
    { data: events },
    { data: members },
    { data: posts },
    { data: pages }
  ] = await Promise.all([
    supabase.from('actions').select('slug, updated_at').eq('is_published', true),
    supabase.from('events').select('slug, updated_at').eq('is_published', true),
    supabase.from('members').select('slug, updated_at').eq('is_active', true),
    supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true),
    supabase.from('custom_pages').select('slug, updated_at').eq('is_published', true)
  ])

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/actions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/membres`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/galerie`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...(actions?.map((action) => ({
      url: `${baseUrl}/actions/${action.slug}`,
      lastModified: new Date(action.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []),
    ...(events?.map((event) => ({
      url: `${baseUrl}/evenements/${event.slug}`,
      lastModified: new Date(event.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []),
    ...(members?.map((member) => ({
      url: `${baseUrl}/membres/${member.slug}`,
      lastModified: new Date(member.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })) || []),
    ...(posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) || []),
    ...(pages?.map((page) => ({
      url: `${baseUrl}/p/${page.slug}`,
      lastModified: new Date(page.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })) || []),
  ]
}
