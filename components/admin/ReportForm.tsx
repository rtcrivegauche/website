'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import PdfUploader from '@/components/admin/PdfUploader'

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
})

type ReportData = {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  pdf_url: string | null
  meeting_date: string
  is_published: boolean
}

export default function ReportForm({ report }: { report: ReportData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: report?.title || '',
    slug: report?.slug || '',
    summary: report?.summary || '',
    content: report?.content || '',
    pdf_url: report?.pdf_url || null,
    meeting_date: report?.meeting_date ? new Date(report.meeting_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    is_published: report?.is_published ?? false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const payload = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        pdf_url: formData.pdf_url,
        meeting_date: formData.meeting_date,
        is_published: formData.is_published,
      }

      if (report?.id) {
        const { error } = await supabase
          .from('reports')
          .update(payload)
          .eq('id', report.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('reports')
          .insert([payload])
        
        if (error) throw error
      }

      router.push('/admin/rapports')
      router.refresh()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!report?.id) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id)
      
      if (error) throw error
      
      router.push('/admin/rapports')
      router.refresh()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Titre du rapport / de la réunion *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value, 
                slug: generateSlug(e.target.value) 
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Réunion Statutaire du 15 Mai 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Slug de l'URL *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Date de la réunion *
            </label>
            <input
              type="date"
              required
              value={formData.meeting_date}
              onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Résumé succinct *
            </label>
            <textarea
              required
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Décisions prises concernant la prochaine action sociale..."
            />
          </div>

          <div className="md:col-span-2">
            <PdfUploader
              value={formData.pdf_url}
              onChange={(url) => setFormData({ ...formData, pdf_url: url })}
              entityId={report?.id}
              label="Document PDF Officiel de compte-rendu (R2)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Contenu détaillé du rapport (Décisions et Points Clés) *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(data) => setFormData({ ...formData, content: data.html })}
              placeholder="Rédigez ou collez le compte-rendu textuel ici..."
            />
          </div>

          <div className="flex items-center md:col-span-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Publier officiellement (Visible immédiatement sur le site public)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : report ? 'Mettre à jour le rapport' : 'Créer le rapport'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>

        {report && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Supprimer
          </button>
        )}
      </div>
    </form>
  )
}
