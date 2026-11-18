'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { reorderItems } from '@/lib/actions/reorder'

interface ReorderRowButtonsProps {
  table: string
  itemId: string
  currentIndex: number
  allIds: string[]
  revalidatePath?: string
}

export default function ReorderRowButtons({
  table,
  itemId,
  currentIndex,
  allIds,
  revalidatePath
}: ReorderRowButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleMove = async (direction: 'up' | 'down') => {
    if (loading) return
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= allIds.length) return

    setLoading(true)
    try {
      const newOrderedIds = [...allIds]
      const temp = newOrderedIds[currentIndex]
      newOrderedIds[currentIndex] = newOrderedIds[targetIndex]
      newOrderedIds[targetIndex] = temp

      const res = await reorderItems({
        table,
        orderedIds: newOrderedIds,
        paths: revalidatePath ? [revalidatePath] : []
      })

      if (res.success) {
        router.refresh()
      } else {
        alert(`Impossible de réordonner : ${res.error}`)
      }
    } catch (err) {
      console.error('Erreur réordonnancement:', err)
    } finally {
      setLoading(false)
    }
  }

  const isFirst = currentIndex === 0
  const isLast = currentIndex === allIds.length - 1

  return (
    <div className="inline-flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => handleMove('up')}
        disabled={isFirst || loading}
        className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#014F43] disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors shadow-2xs"
        title={isFirst ? 'Déjà en première position' : 'Faire monter d\'une position'}
      >
        <ArrowUp size={14} className="stroke-[2.5]" />
      </button>

      <span className="min-w-[28px] text-center text-xs font-black text-[#014F43] px-1 select-none flex items-center justify-center">
        {loading ? (
          <Loader2 size={13} className="animate-spin text-[#014F43]" />
        ) : (
          `#${currentIndex + 1}`
        )}
      </span>

      <button
        type="button"
        onClick={() => handleMove('down')}
        disabled={isLast || loading}
        className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-[#014F43] disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors shadow-2xs"
        title={isLast ? 'Déjà en dernière position' : 'Faire descendre d\'une position'}
      >
        <ArrowDown size={14} className="stroke-[2.5]" />
      </button>
    </div>
  )
}
