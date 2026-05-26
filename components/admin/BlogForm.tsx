'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
})

type PostData = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  content_json?: any | null
  featured_image_url: string
  category: string
  is_published: boolean
  published_at?: string
}

export default function BlogForm({ post }: { post: PostData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    content_json: (post as any)?.content_json || null,
    featured_image_url: post?.featured_image_url || '',
    category: post?.category || '',
    is_published: post?.is_published ?? false,
  })

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const dataToSave = {
        ...formData,
        published_at: formData.is_published && !post?.published_at ? new Date().toISOString() : post?.published_at,
      }

      if (post?.id) {
        const { error } = await supabase.from('blog_posts').update(dataToSave).eq('id', post.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('blog_posts').insert([dataToSave])
        if (error) throw error
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
          <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" placeholder="LEADERSHIP, IMPACT, etc." />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            value={formData.featured_image_url || null}
            onChange={(url) => setFormData({ ...formData, featured_image_url: url || '' })}
            entityType="blog"
            entityId={post?.id}
            label="Image d'illustration"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Extrait</label>
          <textarea rows={3} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E11A60]" placeholder="Résumé court de l'article" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
          <RichTextEditor
            value={formData.content_json || formData.content}
            onChange={(data) => setFormData({ ...formData, content: data.html, content_json: data.json })}
            placeholder="Rédigez le contenu riche de l'article de blog..."
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 text-[#E11A60] rounded" />
          <span className="text-sm text-gray-700">Publié</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E11A60] text-white rounded-lg hover:bg-[#1ab030] transition disabled:opacity-50 font-medium">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
          Annuler
        </button>
      </div>
    </form>
  )
}
