'use server'

import { createClient } from '@/lib/supabase/server'

export async function getFeaturedEvent() {
  const supabase = await createClient()
  
  const { data: featured } = await supabase
    .from('home_featured_items')
    .select('item_id')
    .eq('section_key', 'featured_event')
    .eq('is_active', true)
    .single()

  if (!featured) {
    // Fallback : prendre le prochain événement
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(1)
      .single()
    
    return data
  }

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', featured.item_id)
    .eq('is_published', true)
    .single()

  return event
}

export async function getFeaturedActions() {
  const supabase = await createClient()
  
  const { data: featured } = await supabase
    .from('home_featured_items')
    .select('item_id, order_index')
    .eq('section_key', 'featured_actions')
    .eq('is_active', true)
    .order('order_index')

  if (!featured || featured.length === 0) {
    // Fallback : prendre les 3 dernières actions
    const { data } = await supabase
      .from('actions')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
    
    return data || []
  }

  const ids = featured.map(f => f.item_id)
  const { data: actions } = await supabase
    .from('actions')
    .select('*')
    .in('id', ids)
    .eq('is_published', true)

  // Réordonner selon order_index
  const orderedActions = featured
    .map(f => actions?.find(a => a.id === f.item_id))
    .filter(Boolean)

  return orderedActions
}

export async function getFeaturedMembers() {
  const supabase = await createClient()
  
  const { data: featured } = await supabase
    .from('home_featured_items')
    .select('item_id, order_index')
    .eq('section_key', 'featured_members')
    .eq('is_active', true)
    .order('order_index')

  if (!featured || featured.length === 0) {
    // Fallback : prendre 3 membres aléatoires
    const { data } = await supabase
      .from('members')
      .select('*')
      .eq('is_active', true)
      .limit(6)
    
    return data || []
  }

  const ids = featured.map(f => f.item_id)
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .in('id', ids)
    .eq('is_active', true)

  // Réordonner selon order_index
  const orderedMembers = featured
    .map(f => members?.find(m => m.id === f.item_id))
    .filter(Boolean)

  return orderedMembers
}

export async function getFeaturedGallery() {
  const supabase = await createClient()
  
  const { data: featured } = await supabase
    .from('home_featured_items')
    .select('item_id, order_index')
    .eq('section_key', 'featured_gallery')
    .eq('is_active', true)
    .order('order_index')

  if (!featured || featured.length === 0) {
    // Fallback : prendre 6 dernières images
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    return data || []
  }

  const ids = featured.map(f => f.item_id)
  const { data: gallery } = await supabase
    .from('gallery_items')
    .select('*')
    .in('id', ids)
    .eq('is_active', true)

  // Réordonner selon order_index
  const orderedGallery = featured
    .map(f => gallery?.find(g => g.id === f.item_id))
    .filter(Boolean)

  return orderedGallery
}

export async function getFeaturedPosts() {
  const supabase = await createClient()
  
  const { data: featured } = await supabase
    .from('home_featured_items')
    .select('item_id, order_index')
    .eq('section_key', 'featured_posts')
    .eq('is_active', true)
    .order('order_index')

  if (!featured || featured.length === 0) {
    // Fallback : prendre les 3 derniers articles
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(4)
    
    return data || []
  }

  const ids = featured.map(f => f.item_id)
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .in('id', ids)
    .eq('is_published', true)

  // Réordonner selon order_index
  const orderedPosts = featured
    .map(f => posts?.find(p => p.id === f.item_id))
    .filter(Boolean)

  return orderedPosts
}
