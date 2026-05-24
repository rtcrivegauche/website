'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CustomPageFormProps {
  page?: {
    id: string
    slug: string
    title: string
    description: string | null
    content_type: string
    rich_content: any
    embed_code: string | null
    meta_title: string | null
    meta_description: string | null
    og_image_url: string | null
    is_published: boolean
  }
}

export default function CustomPageForm({ page }: CustomPageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    description: page?.description || '',
    content_type: page?.content_type || 'embed',
    embed_code: page?.embed_code || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    og_image_url: page?.og_image_url || '',
    is_published: page?.is_published || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      if (page) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('custom_pages')
          .update(formData)
          .eq('id', page.id)

        if (updateError) throw updateError
      } else {
        // Création
        const { error: insertError } = await supabase
          .from('custom_pages')
          .insert([formData])

        if (insertError) throw insertError
      }

      router.push('/admin/pages')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Informations de base</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de la page *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="Rejoindre le Rotaract Cica"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) *
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">/p/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="rejoindre-le-club"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Utilisez uniquement des lettres minuscules, chiffres et tirets
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="Courte description de la page"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Contenu</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de contenu *
          </label>
          <select
            value={formData.content_type}
            onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          >
            <option value="embed">Code intégré (Tally, YouTube, etc.)</option>
            <option value="rich_text">Contenu riche (à venir)</option>
            <option value="hybrid">Hybride (à venir)</option>
          </select>
        </div>

        {formData.content_type === 'embed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code HTML à intégrer *
            </label>
            <textarea
              value={formData.embed_code}
              onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent font-mono text-sm"
              placeholder="<iframe data-tally-src=&quot;https://tally.so/r/YOUR_FORM_ID&quot; ...></iframe>"
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 <strong>Tally :</strong> Copiez le code d&apos;intégration depuis Tally → Share → Embed → Full page
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">SEO (optionnel)</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre SEO
          </label>
          <input
            type="text"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="Si vide, utilisera le titre de la page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description SEO
          </label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="Description pour les moteurs de recherche"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-5 h-5 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
          />
          <div>
            <div className="font-medium text-gray-900">Publier cette page</div>
            <div className="text-sm text-gray-500">
              La page sera accessible publiquement à l&apos;URL /p/{formData.slug || 'slug'}
            </div>
          </div>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : page ? 'Mettre à jour' : 'Créer la page'}
        </button>
      </div>
    </form>
  )
}
