import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Member = Database['public']['Tables']['members']['Row']

export async function getMembers(activeOnly = true) {
  const supabase = await createClient()
  
  let query = supabase
    .from('members')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (activeOnly) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Member[]
}

export async function getFeaturedMembers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
  
  if (error) throw error
  return data as Member[]
}
