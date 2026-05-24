import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Action = Database['public']['Tables']['actions']['Row']

export async function getActions(publishedOnly = true) {
  const supabase = await createClient()
  
  let query = supabase
    .from('actions')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (publishedOnly) {
    query = query.eq('is_published', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Action[]
}

export async function getFeaturedActions() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(4)
  
  if (error) throw error
  return data as Action[]
}
