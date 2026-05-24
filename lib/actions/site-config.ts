'use server'

import { createClient } from '@/lib/supabase/server'

export async function getSiteConfig() {
  const supabase = await createClient()
  
  // select('*') récupère toutes les colonnes incluant hero_cta_primary_url et hero_cta_secondary_url
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching site config:', error)
    return null
  }

  return data
}

export async function getHeroLabels() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('hero_labels')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching hero labels:', error)
    return []
  }

  return data || []
}

export async function getAboutValues() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('about_values')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching about values:', error)
    return []
  }

  return data || []
}
