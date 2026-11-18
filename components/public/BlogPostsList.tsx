'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag, ArrowRight, FileText } from 'lucide-react'
import PaginationControls from '@/components/public/PaginationControls'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featured_image_url?: string | null
  category?: string | null
  published_at?: string | null
  gallery_images?: string[] | null
  display_order?: number
}

interface BlogPostsListProps {
  posts: BlogPost[]
}

const ITEMS_PER_PAGE = 6

export default function BlogPostsList({ posts }: BlogPostsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => {
      if (p.category && p.category.trim() !== '') {
        set.add(p.category.trim())
      }
    })
    return Array.from(set)
  }, [posts])

  // Réinitialiser la page à 1 lors du changement de catégorie
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter((p) => p.category?.trim() === selectedCategory)
  }, [posts, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPosts, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Filtres par Catégorie si plus d'une catégorie existe */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#014F43] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tous les articles ({posts.length})
          </button>

          {categories.map((cat) => {
            const count = posts.filter((p) => p.category?.trim() === cat).length
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#22C83A] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Message vide */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-200 max-w-xl mx-auto px-6">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Aucun article dans cette catégorie</h3>
          <p className="text-sm text-gray-500 mb-4">
            Revenez très bientôt pour découvrir nos prochaines publications !
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-[#014F43] hover:underline"
          >
            Afficher tous les articles →
          </button>
        </div>
      ) : (
        <>
          {/* Grille des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((post) => {
              const hasGallery = Array.isArray(post.gallery_images) && post.gallery_images.length > 0

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-gray-100/50"
                >
                  <div>
                    {post.featured_image_url && (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={post.featured_image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-[#22C83A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                              {post.category}
                            </span>
                          </div>
                        )}

                        {hasGallery && (
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            📷 {post.gallery_images?.length} photo{(post.gallery_images?.length || 0) > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      {post.published_at && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-2">
                          <Calendar size={13} className="text-[#014F43]" />
                          <span>
                            {new Date(post.published_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      <h3 className="text-2xl font-bold text-[#014F43] mb-3 group-hover:text-[#22C83A] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed text-sm">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-[#014F43] font-semibold text-sm group-hover:text-[#22C83A] transition-colors">
                    <span>Lire l&apos;article</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPosts.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            itemName="articles"
          />
        </>
      )}
    </div>
  )
}
