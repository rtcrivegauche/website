import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type GalleryItem = Database['public']['Tables']['gallery']['Row']

export async function getGalleryItems(limit?: number) {
  const supabase = await createClient()
  
  let query = supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as GalleryItem[]
}
