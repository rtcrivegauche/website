'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-gray-50 border border-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Chargement de l'éditeur riche...</div>
})

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
  const [activeTab, setActiveTab] = useState<'editor' | 'drafts' | 'history' | 'preview'>('editor')
  const [activeSidebarTab, setActiveSidebarTab] = useState<'settings' | 'revisions'>('settings')
  
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    description: page?.description || '',
    content_type: page?.content_type || 'rich_text',
    embed_code: page?.embed_code || '',
    rich_content: page?.rich_content || null,
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
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#f4f7f9] -m-6 p-6">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
          {error}
        </div>
      )}

      {/* Barre d'en-tête supérieure ultra moderne */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        {/* Onglets de gauche */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`text-sm font-bold tracking-wide transition-all pb-1 border-b-2 ${
              activeTab === 'editor' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Page Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`text-sm font-bold tracking-wide transition-all pb-1 border-b-2 ${
              activeTab === 'drafts' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Drafts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`text-sm font-bold tracking-wide transition-all pb-1 border-b-2 ${
              activeTab === 'history' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`text-sm font-bold tracking-wide transition-all pb-1 border-b-2 ${
              activeTab === 'preview' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Boutons de droite */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            Save
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#014F43] hover:bg-[#00362d] text-white text-xs font-bold rounded-lg tracking-wider uppercase transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Sauvegarde...' : 'Publish'}
          </button>
          
          <div className="w-[1px] h-6 bg-gray-200" />
          
          <button
            type="button"
            onClick={() => router.push('/admin/pages')}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all text-lg font-bold"
            title="Fermer"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Corps principal split-screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Colonne de Gauche : Notion-style Writing Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bloc 1 : Titre (Sans distractions) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full text-3xl font-extrabold text-gray-900 border-none outline-none focus:outline-none focus:ring-0 placeholder-gray-300 bg-transparent py-2"
              placeholder="Ajouter un titre..."
            />
          </div>

          {/* Bloc 2 : Éditeur Tiptap (Vaste et Ouvert) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            {(formData.content_type === 'rich_text' || formData.content_type === 'hybrid') && (
              <div className="space-y-4">
                <RichTextEditor
                  value={formData.rich_content?.html || ''}
                  onChange={(data) => setFormData({
                    ...formData,
                    rich_content: { html: data.html, json: data.json }
                  })}
                  placeholder="Tapez / pour choisir un bloc ou commencez à écrire..."
                  minHeight="550px"
                />
              </div>
            )}

            {formData.content_type === 'embed' && (
              <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <p className="text-gray-500 font-medium">Cette page utilise un formulaire ou un script HTML intégré uniquement.</p>
                <p className="text-xs text-gray-400 mt-2">Vous pouvez configurer le code de l&apos;iframe ou le script dans le panneau de droite.</p>
              </div>
            )}

            {/* Bouton stylisé en bas du bloc d'écriture */}
            <div className="flex justify-center pt-6 border-t border-gray-100">
              <button
                type="button"
                className="px-5 py-2.5 bg-[#014F43] hover:bg-[#00362d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm hover:shadow"
              >
                <span className="text-sm font-semibold">+</span> Ajouter un bloc
              </button>
            </div>
          </div>
        </div>

        {/* Colonne de Droite : Sidebar CMS Premium */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Onglets de la Sidebar */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('settings')}
              className={`flex-1 py-4 text-center text-xs font-extrabold tracking-wider transition-all border-b-2 uppercase ${
                activeSidebarTab === 'settings' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              Paramètres
            </button>
            <button
              type="button"
              onClick={() => setActiveSidebarTab('revisions')}
              className={`flex-1 py-4 text-center text-xs font-extrabold tracking-wider transition-all border-b-2 uppercase ${
                activeSidebarTab === 'revisions' ? 'text-[#014F43] border-[#014F43]' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              Révisions
            </button>
          </div>

          <div className="p-6 space-y-6">
            {activeSidebarTab === 'settings' ? (
              <>
                {/* Section ACTIONS */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</h4>
                  <div className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2.5 bg-[#014F43] hover:bg-[#00362d] text-white text-xs font-bold rounded-lg tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Sauvegarde...' : page ? 'Mettre à jour la page' : 'Créer la page'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors text-center"
                    >
                      Annuler
                    </button>
                  </div>
                </div>

                {/* Section PARAMÈTRES DE PAGE */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Paramètres de page</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        Titre de la page *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none"
                        placeholder="À propos de nous"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        Slug (URL) *
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-xs font-semibold text-gray-500">/p/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                          required
                          className="flex-1 px-3.5 py-2 border border-gray-300 rounded-r-lg text-sm focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none"
                          placeholder="a-propos"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        Type de contenu *
                      </label>
                      <select
                        value={formData.content_type}
                        onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none"
                      >
                        <option value="rich_text">Texte riche (Tiptap)</option>
                        <option value="embed">Formulaire / Code HTML</option>
                        <option value="hybrid">Hybride (Texte + Code)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        Résumé / Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Servir, Inspirer, Grandir Ensemble"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Code Intégration (si Embed ou Hybride) */}
                {(formData.content_type === 'embed' || formData.content_type === 'hybrid') && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Code Intégration</h4>
                    <div>
                      <textarea
                        value={formData.embed_code || ''}
                        onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none"
                        placeholder="<iframe src='https://tally.so/r/...' width='100%' height='500'></iframe>"
                        required={formData.content_type === 'embed'}
                      />
                    </div>
                  </div>
                )}

                {/* Section OPTIMISATION SEO */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Optimisation SEO</h4>
                  <div className="space-y-3 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Titre Google
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title || ''}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none"
                        placeholder="Si vide, utilise le titre de la page"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Description Meta
                      </label>
                      <textarea
                        value={formData.meta_description || ''}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-[#014F43] focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Description affichée sous Google"
                      />
                    </div>
                  </div>
                </div>

                {/* Section PUBLIER LA PAGE (Style Premium) */}
                <div className="p-4 bg-[#f0f9f6] border border-[#d1ebd7] rounded-xl text-[#00362d] flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-[#014F43] border-[#d1ebd7] rounded focus:ring-[#014F43] accent-[#014F43]"
                    id="publish-checkbox"
                  />
                  <label htmlFor="publish-checkbox" className="cursor-pointer">
                    <div className="font-bold text-xs">Publier la page</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      Visible sur <span className="underline font-semibold">/p/{formData.slug || '...'}</span>
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm italic">
                Aucune révision enregistrée pour cette page.
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
