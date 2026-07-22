'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from '@/components/admin/ImageUploader'

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
    hero_image_url: config?.hero_image_url || '',
    hero_cta_primary: config?.hero_cta_primary || '',
    hero_cta_secondary: config?.hero_cta_secondary || '',
    hero_cta_primary_url: config?.hero_cta_primary_url || '',
    hero_cta_secondary_url: config?.hero_cta_secondary_url || '',
    og_image_url: config?.og_image_url || '',
    about_image_url: config?.about_image_url || '',
    about_badge_number: config?.about_badge_number || '98%',
    about_badge_text: config?.about_badge_text || 'Satisfaction des membres dans nos projets communautaires.',
    stat_1_value: config?.stat_1_value ?? 15,
    stat_1_suffix: config?.stat_1_suffix || '',
    stat_1_label: config?.stat_1_label || "ans d'impact",
    stat_2_value: config?.stat_2_value ?? 100,
    stat_2_suffix: config?.stat_2_suffix || '+',
    stat_2_label: config?.stat_2_label || 'actions réalisées',
    stat_3_value: config?.stat_3_value ?? 500,
    stat_3_suffix: config?.stat_3_suffix || '+',
    stat_3_label: config?.stat_3_label || 'personnes touchées',
  })

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
            <ImageUploader
              value={formData.site_logo_url || null}
              onChange={(url) => setFormData(prev => ({ ...prev, site_logo_url: url || '' }))}
              entityType="config"
              entityId={config?.id}
              label="Logo du site principal (Header)"
            />
          </div>

          {/* Logo Footer */}
          <div className="space-y-3">
            <ImageUploader
              value={formData.footer_logo_url || null}
              onChange={(url) => setFormData(prev => ({ ...prev, footer_logo_url: url || '' }))}
              entityType="config"
              entityId={config?.id}
              label="Logo de pied de page (Footer)"
            />
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

        <div className="pb-4 border-b border-gray-100">
          <ImageUploader
            value={formData.hero_image_url || null}
            onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url || '' }))}
            entityType="config"
            entityId={config?.id}
            label="Image capsule centrale du Hero (Servir [Image] Inspirer)"
          />
        </div>

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

      {/* Image de Partage Réseaux Sociaux (Open Graph) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Image de Partage Réseaux Sociaux (Open Graph & WhatsApp)</h2>
        <p className="text-xs text-gray-500">
          Cette image s'affiche automatiquement lorsque vous partagez le lien du site sur WhatsApp, Facebook, LinkedIn ou Twitter.
        </p>
        <ImageUploader
          value={formData.og_image_url || null}
          onChange={(url) => setFormData(prev => ({ ...prev, og_image_url: url || '' }))}
          entityType="config"
          entityId={config?.id}
          label="Image officielle de partage social (Open Graph / WhatsApp)"
        />
      </div>

      {/* Section À Propos de la Page d'Accueil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Section À Propos (Page d'accueil)</h2>
        
        <ImageUploader
          value={formData.about_image_url || null}
          onChange={(url) => setFormData(prev => ({ ...prev, about_image_url: url || '' }))}
          entityType="config"
          entityId={config?.id}
          label="Image principale de présentation d'À Propos"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chiffre / Statut du Badge (ex: 98%)
            </label>
            <input
              type="text"
              value={formData.about_badge_number}
              onChange={(e) => setFormData({ ...formData, about_badge_number: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43]"
              placeholder="98%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du Badge d'impact
            </label>
            <input
              type="text"
              value={formData.about_badge_text}
              onChange={(e) => setFormData({ ...formData, about_badge_text: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43]"
              placeholder="Satisfaction des membres..."
            />
          </div>
        </div>
      </div>

      {/* Section Chiffres Clés d'Impact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Chiffres Clés d'Impact (Page d'accueil)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-[#014F43]">Statistique 1 (avec Trophée)</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="number"
                value={formData.stat_1_value}
                onChange={(e) => setFormData({ ...formData, stat_1_value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Suffixe (ex: + ou %)</label>
              <input
                type="text"
                value={formData.stat_1_suffix}
                onChange={(e) => setFormData({ ...formData, stat_1_suffix: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Libellé</label>
              <input
                type="text"
                value={formData.stat_1_label}
                onChange={(e) => setFormData({ ...formData, stat_1_label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-[#014F43]">Statistique 2</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="number"
                value={formData.stat_2_value}
                onChange={(e) => setFormData({ ...formData, stat_2_value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Suffixe (ex: +)</label>
              <input
                type="text"
                value={formData.stat_2_suffix}
                onChange={(e) => setFormData({ ...formData, stat_2_suffix: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Libellé</label>
              <input
                type="text"
                value={formData.stat_2_label}
                onChange={(e) => setFormData({ ...formData, stat_2_label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-[#014F43]">Statistique 3</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="number"
                value={formData.stat_3_value}
                onChange={(e) => setFormData({ ...formData, stat_3_value: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Suffixe (ex: +)</label>
              <input
                type="text"
                value={formData.stat_3_suffix}
                onChange={(e) => setFormData({ ...formData, stat_3_suffix: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Libellé</label>
              <input
                type="text"
                value={formData.stat_3_label}
                onChange={(e) => setFormData({ ...formData, stat_3_label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
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
