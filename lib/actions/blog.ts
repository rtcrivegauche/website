import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export async function getBlogPosts(publishedOnly = true, limit?: number) {
  const supabase = await createClient()
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false })
  
  if (publishedOnly) {
    query = query.eq('is_published', true)
  }
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as BlogPost[]
}
