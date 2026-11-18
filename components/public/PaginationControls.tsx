'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  itemName?: string
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = 'éléments'
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  // Calcul des numéros de pages visibles avec ellipses si nécessaire
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
      {/* Résumé du nombre d'éléments */}
      <div className="text-xs sm:text-sm text-gray-500 font-medium">
        {totalItems && startItem && endItem ? (
          <span>
            Affichage de <strong className="text-gray-900">{startItem}</strong> à{' '}
            <strong className="text-gray-900">{endItem}</strong> sur{' '}
            <strong className="text-gray-900">{totalItems}</strong> {itemName}
          </span>
        ) : (
          <span>Page {currentPage} sur {totalPages}</span>
        )}
      </div>

      {/* Contrôles de navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-[#014F43] hover:text-white hover:border-[#014F43] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
          title="Page précédente"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {/* Numéros de page */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 font-bold select-none text-xs">
                  ...
                </span>
              )
            }

            const pageNum = p as number
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[38px] h-[38px] rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'bg-[#014F43] text-white shadow-md scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-[#014F43] hover:text-white hover:border-[#014F43] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
          title="Page suivante"
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
