'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  HeartHandshake, 
  Smartphone, 
  Building2, 
  MessageSquare, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck,
  PhoneCall,
  Save,
  Info
} from 'lucide-react'

interface DonationConfigFormProps {
  config: any
}

export default function DonationConfigForm({ config }: DonationConfigFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    donation_title: config?.donation_title || 'Soutenez nos actions solidaires',
    donation_subtitle: config?.donation_subtitle || 'Chaque don, petit ou grand, a un impact réel et direct sur la vie des communautés au Bénin.',
    donation_intro_text: config?.donation_intro_text || 'Votre générosité permet de financer nos actions en faveur de l\'éducation des enfants démunis, de la santé communautaire et de la préservation de l\'environnement au Bénin.',
    donation_whatsapp_number: config?.donation_whatsapp_number || config?.contact_phone || '+229 97 00 00 00',

    // MTN MoMo
    donation_mtn_active: config?.donation_mtn_active ?? true,
    donation_mtn_number: config?.donation_mtn_number || '97 00 00 00',
    donation_mtn_name: config?.donation_mtn_name || 'Rotaract Club de Cotonou Rive Gauche Cica',
    donation_mtn_merchant_code: config?.donation_mtn_merchant_code || '',
    donation_mtn_instructions: config?.donation_mtn_instructions || 'Tapez *880# option 1 (Envoi d\'argent) ou faites un transfert MoMo direct.',

    // Moov Money
    donation_moov_active: config?.donation_moov_active ?? true,
    donation_moov_number: config?.donation_moov_number || '95 00 00 00',
    donation_moov_name: config?.donation_moov_name || 'Rotaract Club de Cotonou Rive Gauche Cica',
    donation_moov_merchant_code: config?.donation_moov_merchant_code || '',
    donation_moov_instructions: config?.donation_moov_instructions || 'Tapez *855# option 1 ou effectuez votre transfert direct Flooz.',

    // Celtiis Cash
    donation_celtiis_active: config?.donation_celtiis_active ?? true,
    donation_celtiis_number: config?.donation_celtiis_number || '40 00 00 00',
    donation_celtiis_name: config?.donation_celtiis_name || 'Rotaract Club de Cotonou Rive Gauche Cica',
    donation_celtiis_instructions: config?.donation_celtiis_instructions || 'Tapez *888# ou transférez directement via l\'application Celtiis Cash.',

    // Virement Bancaire
    donation_bank_active: config?.donation_bank_active ?? true,
    donation_bank_name: config?.donation_bank_name || 'Bank of Africa (BOA Bénin)',
    donation_bank_account_name: config?.donation_bank_account_name || 'CLUB ROTARACT DE COTONOU RIVE GAUCHE CICA',
    donation_bank_rib: config?.donation_bank_rib || 'BJ061 01001 001234567890 12',
    donation_bank_iban: config?.donation_bank_iban || 'BJ66 BJ06 1010 0100 1234 5678 9012',
    donation_bank_swift: config?.donation_bank_swift || 'AFRIBJBJ',
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
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Alertes d'état */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Comptes et coordonnées de dons mis à jour avec succès ! Les modifications sont immédiatement en ligne sur la page de don.</span>
        </div>
      )}

      {/* Guide informatif */}
      <div className="bg-gradient-to-r from-[#014F43]/10 to-[#22C83A]/10 border border-[#014F43]/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-[#014F43] text-white">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#014F43]">
            Configuration des réceptions de dons
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            Renseignez ici les numéros Mobile Money officiels et le RIB bancaire du Club. Ces informations s&apos;afficheront sur la page publique <strong>/faire-un-don</strong> et permettront aux bienfaiteurs de copier les numéros en 1 clic puis de confirmer leur don via WhatsApp.
          </p>
        </div>
      </div>

      {/* 1. TEXTES & NOTIFICATIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <MessageSquare className="w-5 h-5 text-[#014F43]" />
          <h2 className="text-lg font-black text-gray-900">1. Présentation & Confirmation WhatsApp</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Titre principal de la page
            </label>
            <input
              type="text"
              value={formData.donation_title}
              onChange={(e) => setFormData({ ...formData, donation_title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent font-medium"
              placeholder="Ex: Soutenez nos actions solidaires"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Sous-titre accrocheur
            </label>
            <input
              type="text"
              value={formData.donation_subtitle}
              onChange={(e) => setFormData({ ...formData, donation_subtitle: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: Chaque geste compte pour changer des vies..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Texte d&apos;introduction / Plaidoyer
            </label>
            <textarea
              rows={3}
              value={formData.donation_intro_text}
              onChange={(e) => setFormData({ ...formData, donation_intro_text: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Expliquez la portée des dons..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Numéro WhatsApp de confirmation (Trésorerie)
            </label>
            <div className="relative">
              <PhoneCall className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.donation_whatsapp_number}
                onChange={(e) => setFormData({ ...formData, donation_whatsapp_number: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                placeholder="Ex: +229 97 00 00 00"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Les donateurs cliqueront sur &quot;Confirmer sur WhatsApp&quot; pour envoyer la preuve au trésorier à ce numéro.
            </p>
          </div>
        </div>
      </div>

      {/* 2. COMPTE MTN MOBILE MONEY (MOMO) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-black text-xs shadow-xs">
              MTN
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">2. MTN Mobile Money (MoMo Bénin)</h2>
              <p className="text-xs text-gray-500">Paiement via USSD *880# ou transfert mobile</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.donation_mtn_active}
              onChange={(e) => setFormData({ ...formData, donation_mtn_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-700">
              {formData.donation_mtn_active ? 'Activé' : 'Désactivé'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Numéro de téléphone MoMo
            </label>
            <input
              type="text"
              value={formData.donation_mtn_number}
              onChange={(e) => setFormData({ ...formData, donation_mtn_number: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent font-bold text-gray-900"
              placeholder="Ex: 97 00 00 00 ou +22997000000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom officiel du compte (Titulaire)
            </label>
            <input
              type="text"
              value={formData.donation_mtn_name}
              onChange={(e) => setFormData({ ...formData, donation_mtn_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium"
              placeholder="Ex: Rotaract Cotonou Rive Gauche Cica"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Code Marchand MoMoPay (Optionnel)
            </label>
            <input
              type="text"
              value={formData.donation_mtn_merchant_code}
              onChange={(e) => setFormData({ ...formData, donation_mtn_merchant_code: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Ex: 123456 (laisser vide si transfert standard)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Instructions d&apos;envoi pour le donateur
            </label>
            <input
              type="text"
              value={formData.donation_mtn_instructions}
              onChange={(e) => setFormData({ ...formData, donation_mtn_instructions: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Ex: Tapez *880# option 1 (Envoi d'argent)..."
            />
          </div>
        </div>
      </div>

      {/* 3. COMPTE MOOV MONEY (FLOOZ) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-xs">
              MOOV
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">3. Moov Money (Flooz Bénin)</h2>
              <p className="text-xs text-gray-500">Paiement via USSD *855# ou transfert Flooz</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.donation_moov_active}
              onChange={(e) => setFormData({ ...formData, donation_moov_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-700">
              {formData.donation_moov_active ? 'Activé' : 'Désactivé'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Numéro de téléphone Flooz
            </label>
            <input
              type="text"
              value={formData.donation_moov_number}
              onChange={(e) => setFormData({ ...formData, donation_moov_number: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent font-bold text-gray-900"
              placeholder="Ex: 95 00 00 00 ou +22995000000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom officiel du compte (Titulaire)
            </label>
            <input
              type="text"
              value={formData.donation_moov_name}
              onChange={(e) => setFormData({ ...formData, donation_moov_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
              placeholder="Ex: Rotaract Club de Cotonou Rive Gauche Cica"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Code Marchand Flooz (Optionnel)
            </label>
            <input
              type="text"
              value={formData.donation_moov_merchant_code}
              onChange={(e) => setFormData({ ...formData, donation_moov_merchant_code: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Ex: 654321 (laisser vide si transfert standard)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Instructions d&apos;envoi pour le donateur
            </label>
            <input
              type="text"
              value={formData.donation_moov_instructions}
              onChange={(e) => setFormData({ ...formData, donation_moov_instructions: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Ex: Tapez *855# option 1 ou effectuez votre transfert direct..."
            />
          </div>
        </div>
      </div>

      {/* 4. COMPTE CELTIIS CASH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center font-black text-white text-xs shadow-xs">
              CEL
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">4. Celtiis Cash (SBIN Bénin)</h2>
              <p className="text-xs text-gray-500">Paiement via USSD *888# ou appli Celtiis Cash</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.donation_celtiis_active}
              onChange={(e) => setFormData({ ...formData, donation_celtiis_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-700"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-700">
              {formData.donation_celtiis_active ? 'Activé' : 'Désactivé'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Numéro de téléphone Celtiis Cash
            </label>
            <input
              type="text"
              value={formData.donation_celtiis_number}
              onChange={(e) => setFormData({ ...formData, donation_celtiis_number: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-700 focus:border-transparent font-bold text-gray-900"
              placeholder="Ex: 40 00 00 00"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom officiel du compte
            </label>
            <input
              type="text"
              value={formData.donation_celtiis_name}
              onChange={(e) => setFormData({ ...formData, donation_celtiis_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-700 focus:border-transparent font-medium"
              placeholder="Ex: Rotaract Club de Cotonou Rive Gauche Cica"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Instructions pour le donateur
            </label>
            <input
              type="text"
              value={formData.donation_celtiis_instructions}
              onChange={(e) => setFormData({ ...formData, donation_celtiis_instructions: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              placeholder="Ex: Tapez *888# ou transférez directement via l'application Celtiis Cash."
            />
          </div>
        </div>
      </div>

      {/* 5. COMPTE BANCAIRE (VIREMENT / RIB) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#014F43] flex items-center justify-center font-black text-white text-xs shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">5. Compte Bancaire Officiel (RIB / Virement)</h2>
              <p className="text-xs text-gray-500">Pour les dons importants, entreprises, mécènes et donateurs internationaux</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.donation_bank_active}
              onChange={(e) => setFormData({ ...formData, donation_bank_active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014F43]"></div>
            <span className="ml-2.5 text-xs font-bold text-gray-700">
              {formData.donation_bank_active ? 'Activé' : 'Désactivé'}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom de la Banque
            </label>
            <input
              type="text"
              value={formData.donation_bank_name}
              onChange={(e) => setFormData({ ...formData, donation_bank_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent font-medium"
              placeholder="Ex: Bank of Africa (BOA Bénin), Ecobank, etc."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Nom du titulaire du compte
            </label>
            <input
              type="text"
              value={formData.donation_bank_account_name}
              onChange={(e) => setFormData({ ...formData, donation_bank_account_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#014F43] focus:border-transparent font-medium"
              placeholder="Ex: CLUB ROTARACT DE COTONOU RIVE GAUCHE CICA"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Relevé d&apos;Identité Bancaire (RIB complet - 24 chiffres)
            </label>
            <input
              type="text"
              value={formData.donation_bank_rib}
              onChange={(e) => setFormData({ ...formData, donation_bank_rib: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: BJ061 01001 001234567890 12"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              IBAN (pour les virements internationaux)
            </label>
            <input
              type="text"
              value={formData.donation_bank_iban}
              onChange={(e) => setFormData({ ...formData, donation_bank_iban: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: BJ66 BJ06 1010 0100 1234 5678 9012"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Code SWIFT / BIC
            </label>
            <input
              type="text"
              value={formData.donation_bank_swift}
              onChange={(e) => setFormData({ ...formData, donation_bank_swift: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono uppercase tracking-wider focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
              placeholder="Ex: AFRIBJBJ"
            />
          </div>
        </div>
      </div>

      {/* BOUTON DE SAUVEGARDE */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Chaque modification est sauvegardée en base de données et prend effet immédiatement.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#014F43] text-white rounded-xl hover:bg-[#00362d] transition-all font-black text-sm shadow-md hover:shadow-xl cursor-pointer disabled:opacity-50"
        >
          <Save size={18} />
          <span>{loading ? 'Enregistrement en cours...' : 'Enregistrer les comptes de don'}</span>
        </button>
      </div>
    </form>
  )
}
