'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

interface ConfigFormProps {
  config: any
}

export default function ConfigForm({ config }: ConfigFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    site_name: config?.site_name || '',
    site_description: config?.site_description || '',
    site_logo_url: config?.site_logo_url || '',
    footer_logo_url: config?.footer_logo_url || '',
    contact_email: config?.contact_email || '',
    contact_phone: config?.contact_phone || '',
    contact_address: config?.contact_address || '',
    social_facebook: config?.social_facebook || '',
    social_instagram: config?.social_instagram || '',
    social_linkedin: config?.social_linkedin || '',
    social_twitter: config?.social_twitter || '',
    hero_subtitle: config?.hero_subtitle || '',
    hero_cta_primary: config?.hero_cta_primary || '',
    hero_cta_secondary: config?.hero_cta_secondary || '',
    hero_cta_primary_url: config?.hero_cta_primary_url || '',
    hero_cta_secondary_url: config?.hero_cta_secondary_url || '',
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'site_logo_url' | 'footer_logo_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${fieldName}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `logos/${fileName}`

      // Uploader vers le bucket 'images' public
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique du fichier uploadé
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      // Mettre à jour le formulaire avec l'URL publique générée
      setFormData(prev => ({
        ...prev,
        [fieldName]: publicUrl
      }))
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors de l\'upload de l\'image')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = (fieldName: 'site_logo_url' | 'footer_logo_url') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('site_config')
        .update(formData)
        .eq('id', config.id)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Configuration enregistrée avec succès !
        </div>
      )}

      {/* Logos du site */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Logos du site</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Principal (Header) */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Logo du site principal (Header)
            </label>
            
            {formData.site_logo_url ? (
              <div className="relative w-fit border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-center max-w-xs group">
                <img 
                  src={formData.site_logo_url} 
                  alt="Logo Header Preview" 
                  className="h-16 w-auto object-contain" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage('site_logo_url')}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  title="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 max-w-xs">
                <ImageIcon className="text-gray-400 mb-2" size={32} />
                <span className="text-xs text-gray-500 mb-2">Aucun logo principal configuré</span>
              </div>
            )}

            <div className="relative w-fit">
              <input
                type="file"
                id="header_logo"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'site_logo_url')}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="header_logo"
                className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload size={14} />
                {formData.site_logo_url ? 'Changer de logo' : 'Uploader un logo'}
              </label>
            </div>
          </div>

          {/* Logo Footer */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Logo de pied de page (Footer)
            </label>
            
            {formData.footer_logo_url ? (
              <div className="relative w-fit border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center justify-center max-w-xs group">
                <img 
                  src={formData.footer_logo_url} 
                  alt="Logo Footer Preview" 
                  className="h-16 w-auto object-contain" 
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage('footer_logo_url')}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                  title="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50 max-w-xs">
                <ImageIcon className="text-gray-400 mb-2" size={32} />
                <span className="text-xs text-gray-500 mb-2">Aucun logo de pied de page configuré</span>
              </div>
            )}

            <div className="relative w-fit">
              <input
                type="file"
                id="footer_logo"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'footer_logo_url')}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="footer_logo"
                className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload size={14} />
                {formData.footer_logo_url ? 'Changer de logo' : 'Uploader un logo'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Informations générales</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du site
          </label>
          <input
            type="text"
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du site
          </label>
          <textarea
            value={formData.site_description}
            onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Informations de contact</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="text"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={formData.contact_address}
            onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Réseaux sociaux</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.social_facebook}
              onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.social_instagram}
              onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.social_linkedin}
              onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://linkedin.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={formData.social_twitter}
              onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Section Hero (Page d&apos;accueil)</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <textarea
            value={formData.hero_subtitle}
            onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte bouton primaire
            </label>
            <input
              type="text"
              value={formData.hero_cta_primary}
              onChange={(e) => setFormData({ ...formData, hero_cta_primary: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL bouton primaire
            </label>
            <input
              type="text"
              value={formData.hero_cta_primary_url}
              onChange={(e) => setFormData({ ...formData, hero_cta_primary_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="/p/rejoindre-le-club"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte bouton secondaire
            </label>
            <input
              type="text"
              value={formData.hero_cta_secondary}
              onChange={(e) => setFormData({ ...formData, hero_cta_secondary: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL bouton secondaire
            </label>
            <input
              type="text"
              value={formData.hero_cta_secondary_url}
              onChange={(e) => setFormData({ ...formData, hero_cta_secondary_url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="/actions"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3.5 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50 font-bold shadow-md hover:shadow-lg"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  )
}
