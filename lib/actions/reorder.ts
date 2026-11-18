'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reorderItems({
  table,
  orderedIds,
  paths = []
}: {
  table: string
  orderedIds: string[]
  paths?: string[]
}) {
  try {
    const supabase = await createClient()

    // Attribue un ordre explicite 1, 2, 3... à chaque identifiant dans le nouvel ordre
    const updates = orderedIds.map((id, index) =>
      supabase
        .from(table)
        .update({ display_order: index + 1 })
        .eq('id', id)
    )

    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)
    if (hasError) {
      const err = results.find(r => r.error)?.error
      console.error('Erreur SQL lors du réordonnancement:', err)
      return { success: false, error: err?.message }
    }

    // Rafraîchir les chemins spécifiés et la page d'accueil
    for (const p of paths) {
      revalidatePath(p)
    }
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Exception lors du réordonnancement:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
  }
}
