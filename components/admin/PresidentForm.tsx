'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'

type PresidentData = {
  id?: string
  full_name: string
  term: string
  photo_url: string | null
  message: string
  is_current: boolean
}

export default function PresidentForm({ president }: { president: PresidentData | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    full_name: president?.full_name || '',
    term: president?.term || '',
    photo_url: president?.photo_url || '',
    message: president?.message || '',
    is_current: president?.is_current ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const dataToSave = {
        full_name: formData.full_name,
        term: formData.term,
        photo_url: formData.photo_url || null,
        message: formData.message,
        is_current: formData.is_current,
        updated_at: new Date().toISOString()
      }

      // Si le président actuel est marqué comme président en cours
      if (formData.is_current) {
        // Mettre à jour tous les autres présidents à is_current = false
        const query = supabase
          .from('presidents')
          .update({ is_current: false })
          
        if (president?.id) {
          query.neq('id', president.id)
        }
        
        const { error: updateError } = await query
        if (updateError) throw updateError
      }

      if (president?.id) {
        const { error } = await supabase
          .from('presidents')
          .update(dataToSave)
          .eq('id', president.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('presidents')
          .insert([dataToSave])
        if (error) throw error
      }

      router.push('/admin/presidents')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!president?.id) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce président ?')) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('presidents')
        .delete()
        .eq('id', president.id)
      
      if (error) throw error
      
      router.push('/admin/presidents')
      router.refresh()
    } catch (err) {
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Mandat / Année d'exercice *
            </label>
            <input
              type="text"
              required
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Ex: Mandat 2025-2026"
            />
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="w-5 h-5 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Définir comme Président du mandat en cours
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <ImageUploader
              value={formData.photo_url || null}
              onChange={(url) => setFormData({ ...formData, photo_url: url || '' })}
              entityType="presidents"
              entityId={president?.id}
              label="Photo du Président (R2)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">
              Mot / Message du Président *
            </label>
            <textarea
              required
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent transition-all"
              placeholder="Écrivez le message officiel du président pour la page d'accueil..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : president ? 'Mettre à jour' : 'Ajouter le président'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>

        {president && (
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
