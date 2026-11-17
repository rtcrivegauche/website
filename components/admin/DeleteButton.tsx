'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DeleteButtonProps {
  table: string
  id: string
  itemName?: string
  variant?: 'table-action' | 'button' | 'icon' | 'link'
  className?: string
  onDeleted?: () => void
}

export default function DeleteButton({
  table,
  id,
  itemName,
  variant = 'table-action',
  className = '',
  onDeleted,
}: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmMsg = itemName
      ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`
      : 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'

    if (!window.confirm(confirmMsg)) {
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createClient()

      // Supprimer les références dans home_featured_items si existantes
      try {
        await supabase
          .from('home_featured_items')
          .delete()
          .eq('item_id', id)
      } catch {
        // Ignorer si la table n'existe pas ou s'il n'y a pas de référence
      }

      // Supprimer l'élément principal
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      if (onDeleted) {
        onDeleted()
      } else {
        router.refresh()
      }
    } catch (err: unknown) {
      console.error('Erreur lors de la suppression:', err)
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.'
      alert('Erreur lors de la suppression : ' + message)
    } finally {
      setIsDeleting(false)
    }
  }

  // Styles selon la variante
  if (variant === 'button') {
    return (
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold rounded-lg transition-colors text-xs border border-red-200/60 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Supprimer cet élément"
      >
        {isDeleting ? (
          <Loader2 size={13} className="animate-spin text-red-600" />
        ) : (
          <Trash2 size={13} />
        )}
        <span>{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
      </button>
    )
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all border border-red-200/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
        title="Supprimer"
      >
        {isDeleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    )
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Supprimer cet élément"
      >
        {isDeleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
        <span>{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
      </button>
    )
  }

  // Variante par défaut 'table-action' (très élégante pour les tableaux admin)
  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Supprimer cet élément"
    >
      {isDeleting ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Trash2 size={13} />
      )}
      <span>{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
    </button>
  )
}
