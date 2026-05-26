'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavigationItem {
  id: string
  label: string
  url: string
  parent_id: string | null
  order_index: number
  is_active: boolean
}

interface NavigationListProps {
  initialItems: NavigationItem[]
}

export default function NavigationList({ initialItems }: NavigationListProps) {
  const [items, setItems] = useState<NavigationItem[]>(initialItems)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const supabase = createClient()

  // Trier les items par order_index
  const sortedItems = [...items].sort((a, b) => a.order_index - b.order_index)

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le lien "${label}" ?`)) {
      return
    }

    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('navigation')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting navigation item:', error)
      alert('Erreur lors de la suppression du lien')
    } finally {
      setLoadingId(null)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return

    const currentItem = sortedItems[index]
    const swapItem = sortedItems[targetIndex]

    // Échanger les order_index
    const currentOrder = currentItem.order_index
    const swapOrder = swapItem.order_index

    // Si les order_index sont identiques ou mal définis, réindexer tout de manière propre
    let newCurrentOrder = swapOrder
    let newSwapOrder = currentOrder

    if (currentOrder === swapOrder) {
      newCurrentOrder = direction === 'up' ? swapOrder - 1 : swapOrder + 1
    }

    setLoadingId(currentItem.id)
    try {
      // Mettre à jour en base de données
      const { error: error1 } = await supabase
        .from('navigation')
        .update({ order_index: newCurrentOrder })
        .eq('id', currentItem.id)

      if (error1) throw error1

      const { error: error2 } = await supabase
        .from('navigation')
        .update({ order_index: newSwapOrder })
        .eq('id', swapItem.id)

      if (error2) throw error2

      // Mettre à jour l'état local
      setItems(items.map(item => {
        if (item.id === currentItem.id) {
          return { ...item, order_index: newCurrentOrder }
        }
        if (item.id === swapItem.id) {
          return { ...item, order_index: newSwapOrder }
        }
        return item
      }))
    } catch (error) {
      console.error('Error moving item:', error)
      alert('Erreur lors du déplacement du lien')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === sortedItems.length - 1

        return (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow ${
              loadingId === item.id ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <GripVertical size={20} className="text-gray-400 flex-shrink-0" />

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900 truncate">{item.label}</h3>
                {!item.is_active && (
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-semibold uppercase tracking-wider rounded">
                    Inactif
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">{item.url}</p>
            </div>

            {/* Contrôles d'ordonnancement */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={isFirst || loadingId !== null}
                className={`p-1.5 rounded transition-colors ${
                  isFirst
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#014F43]'
                }`}
                title="Monter d'un niveau"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={isLast || loadingId !== null}
                className={`p-1.5 rounded transition-colors ${
                  isLast
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#014F43]'
                }`}
                title="Descendre d'un niveau"
              >
                <ArrowDown size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Link
                href={`/admin/navigation/${item.id}`}
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-[#014F43] rounded-lg transition-colors border border-transparent hover:border-gray-200 bg-white"
                title="Modifier"
              >
                <Edit size={16} />
              </Link>
              <button
                onClick={() => handleDelete(item.id, item.label)}
                disabled={loadingId !== null}
                className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-100 bg-white"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
