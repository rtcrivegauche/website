import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Event = Database['public']['Tables']['events']['Row']

export async function getEvents(publishedOnly = true) {
  const supabase = await createClient()
  
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
  
  if (publishedOnly) {
    query = query.eq('is_published', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Event[]
}

export async function getFeaturedEvent() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(1)
    .single()
  
  if (error) return null
  return data as Event
}
