'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavigationItem {
  id: string
  label: string
  url: string
  parent_id: string | null
  display_order: number
  is_active: boolean
  type?: string
  bg_color?: string | null
  text_color?: string | null
  border_color?: string | null
  is_transparent?: boolean
  shape?: string
}

interface NavigationFormProps {
  navItem?: NavigationItem
  parentItems: NavigationItem[]
}

export default function NavigationForm({ navItem, parentItems }: NavigationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    label: navItem?.label || '',
    url: navItem?.url || '',
    parent_id: navItem?.parent_id || '',
    display_order: navItem?.display_order || 0,
    is_active: navItem?.is_active ?? true,
    type: navItem?.type || 'menu',
    bg_color: navItem?.bg_color || '#E11A60',
    text_color: navItem?.text_color || '#FFFFFF',
    border_color: navItem?.border_color || '#E11A60',
    is_transparent: navItem?.is_transparent ?? false,
    shape: navItem?.shape || 'rounded-full',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    // Vérifier la limite de 2 CTA
    if (formData.type === 'cta') {
      const { data: existingCta } = await supabase
        .from('navigation')
        .select('id')
        .eq('type', 'cta')

      if (existingCta) {
        const otherCta = existingCta.filter(item => !navItem || item.id !== navItem.id)
        if (otherCta.length >= 2) {
          setError('Limite atteinte : Vous ne pouvez pas avoir plus de 2 boutons Call to Action dans le header.')
          setLoading(false)
          return
        }
      }
    }

    const data = {
      label: formData.label,
      url: formData.url,
      parent_id: formData.parent_id || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
      type: formData.type,
      bg_color: formData.type === 'cta' ? (formData.is_transparent ? 'transparent' : formData.bg_color) : null,
      text_color: formData.type === 'cta' ? formData.text_color : null,
      border_color: formData.type === 'cta' ? formData.border_color : null,
      is_transparent: formData.type === 'cta' ? formData.is_transparent : false,
      shape: formData.type === 'cta' ? formData.shape : 'rounded-full',
    }

    try {
      if (navItem) {
        const { error } = await supabase
          .from('navigation')
          .update(data)
          .eq('id', navItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('navigation')
          .insert([data])

        if (error) throw error
      }

      router.push('/admin/navigation')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving navigation item:', err)
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de menu *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'menu' })}
            className={`p-4 rounded-xl border text-center font-medium transition-all ${
              formData.type === 'menu'
                ? 'border-[#014F43] bg-[#014F43]/5 text-[#014F43] ring-2 ring-[#014F43]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 Lien de Menu Classique
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'cta' })}
            className={`p-4 rounded-xl border text-center font-medium transition-all ${
              formData.type === 'cta'
                ? 'border-[#E11A60] bg-[#E11A60]/5 text-[#E11A60] ring-2 ring-[#E11A60]'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🎯 Bouton Call to Action (Max 2)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Libellé du {formData.type === 'cta' ? 'Bouton' : 'Lien'} *
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder={formData.type === 'cta' ? 'ex: REJOINDRE LE CLUB' : 'ex: NOS ACTIONS'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de destination *
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            placeholder="/contact ou https://..."
            required
          />
        </div>
      </div>

      {formData.type === 'menu' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Menu Parent (optionnel)
          </label>
          <select
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
            aria-label="Sélectionner un parent"
          >
            <option value="">-- Aucun parent (menu principal) --</option>
            {parentItems
              .filter(item => !navItem || item.id !== navItem.id)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Options de personnalisation avancée pour les CTA */}
      {formData.type === 'cta' && (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            🎨 Personnalisation Graphique du Bouton CTA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de Fond
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.bg_color}
                  disabled={formData.is_transparent}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.bg_color}
                  disabled={formData.is_transparent}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur du Texte
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de la Bordure
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.border_color}
                  onChange={(e) => setFormData({ ...formData, border_color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.border_color}
                  onChange={(e) => setFormData({ ...formData, border_color: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_transparent"
                checked={formData.is_transparent}
                onChange={(e) => setFormData({ ...formData, is_transparent: e.target.checked })}
                className="w-4 h-4 text-[#E11A60] border-gray-300 rounded focus:ring-[#E11A60]"
              />
              <label htmlFor="is_transparent" className="text-sm font-medium text-gray-700">
                Arrière-plan Transparent (Fond vide)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forme de l'arrondi
              </label>
              <select
                value={formData.shape}
                onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                aria-label="Sélectionner la forme"
              >
                <option value="rounded-full">🟢 Circulaire complet (Pill - Arrondi total)</option>
                <option value="rounded-xl">🟦 Bords adoucis (Arrondi moyen)</option>
                <option value="rounded-md">⬛ Rectangle légèrement arrondi</option>
              </select>
            </div>
          </div>

          {/* APERÇU EN DIRECT DU BOUTON */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
              Aperçu en direct dans le Header :
            </label>
            <div className="p-6 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
              <button
                type="button"
                style={{
                  backgroundColor: formData.is_transparent ? 'transparent' : formData.bg_color,
                  color: formData.text_color,
                  borderColor: formData.border_color,
                  borderWidth: '2px',
                  borderStyle: 'solid'
                }}
                className={`px-5 py-2.5 text-sm font-bold shadow-sm transition-all ${formData.shape}`}
              >
                {formData.label || 'VOTRE BOUTON CTA'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre d'affichage
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-[#014F43] border-gray-300 rounded focus:ring-[#014F43]"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Élément actif dans la navigation
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#014F43] text-white rounded-lg hover:bg-[#00362d] transition-colors disabled:opacity-50 font-bold"
        >
          {loading ? 'Enregistrement...' : navItem ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/navigation')}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
