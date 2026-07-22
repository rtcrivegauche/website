'use client'

import { useState } from 'react'
import { Video, Save, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface TestimonialVideoConfigProps {
  initialVideoUrl?: string
}

export default function TestimonialVideoConfig({ initialVideoUrl = '' }: TestimonialVideoConfigProps) {
  const router = useRouter()
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    try {
      const supabase = createClient()
      
      // Sauvegarder la colonne testimonials_video_url dans la table site_config
      const { data: config } = await supabase.from('site_config').select('id').limit(1).maybeSingle()

      if (config) {
        const { error: updateError } = await supabase
          .from('site_config')
          .update({
            testimonials_video_url: videoUrl.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert([{
            testimonials_video_url: videoUrl.trim() || null
          }])

        if (insertError) throw insertError
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch (err: any) {
      console.error('Erreur sauvegarde vidéo YouTube:', err)
      setError(err.message || 'Impossible de sauvegarder le lien de la vidéo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8 space-y-4">
      <div className="flex items-center gap-2 text-[#014F43] font-bold text-base">
        <Video size={20} className="text-[#E11A60]" />
        <span>Vidéo YouTube de la section Témoignages</span>
      </div>

      <p className="text-xs text-gray-500">
        Renseignez l'URL de la vidéo YouTube (format standard, court youtu.be, ou embed) qui s'affichera dans la section "Témoignages en images" sur la page d'accueil.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center gap-2">
          <Check size={16} />
          <span>URL de la vidéo mise à jour avec succès !</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#014F43] hover:bg-[#00362d] text-white rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-sm"
        >
          <Save size={16} />
          <span>{loading ? 'Enregistrement...' : 'Enregistrer la vidéo'}</span>
        </button>
      </div>
    </form>
  )
}
