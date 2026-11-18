'use client'

import { useState } from 'react'
import { 
  HeartHandshake, 
  Check, 
  Copy, 
  Smartphone, 
  Building2, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react'

interface DonationConfig {
  donation_title?: string | null
  donation_subtitle?: string | null
  donation_intro_text?: string | null
  donation_whatsapp_number?: string | null
  // MTN
  donation_mtn_active?: boolean | null
  donation_mtn_number?: string | null
  donation_mtn_name?: string | null
  donation_mtn_merchant_code?: string | null
  donation_mtn_instructions?: string | null
  // Moov
  donation_moov_active?: boolean | null
  donation_moov_number?: string | null
  donation_moov_name?: string | null
  donation_moov_merchant_code?: string | null
  donation_moov_instructions?: string | null
  // Celtiis
  donation_celtiis_active?: boolean | null
  donation_celtiis_number?: string | null
  donation_celtiis_name?: string | null
  donation_celtiis_instructions?: string | null
  // Banque
  donation_bank_active?: boolean | null
  donation_bank_name?: string | null
  donation_bank_account_name?: string | null
  donation_bank_rib?: string | null
  donation_bank_iban?: string | null
  donation_bank_swift?: string | null
}

interface DonationExperienceProps {
  config: DonationConfig
}

const PRESET_AMOUNTS = [
  { value: 5000, label: '5 000 FCFA', impact: '1 kit scolaire complet et fournitures pour un enfant' },
  { value: 10000, label: '10 000 FCFA', impact: 'Dépistage et soins de santé de base pour 2 personnes' },
  { value: 25000, label: '25 000 FCFA', impact: 'Financement d’ateliers d’autonomisation pour des jeunes' },
  { value: 50000, label: '50 000 FCFA', impact: 'Participation aux forages d’eau potable et reboisement' },
]

const CAUSES = [
  { id: 'all', title: 'Toutes les actions prioritaires du club' },
  { id: 'education', title: 'Éducation & Alphabétisation' },
  { id: 'sante', title: 'Santé communautaire & Maternité' },
  { id: 'environnement', title: 'Environnement & Développement durable' },
]

export default function DonationExperience({ config }: DonationExperienceProps) {
  // Montant sélectionné
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(10000)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [selectedCause, setSelectedCause] = useState<string>('all')

  // Méthode de paiement par défaut
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'moov' | 'celtiis' | 'bank'>('mtn')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Copier dans le presse-papier
  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2500)
    }
  }

  // Calcul du montant final pour le message
  const finalAmountString = selectedAmount === 'custom' 
    ? (customAmount ? `${customAmount} FCFA` : 'un montant libre')
    : `${selectedAmount.toLocaleString('fr-FR')} FCFA`

  const currentCauseTitle = CAUSES.find(c => c.id === selectedCause)?.title || 'nos actions prioritaires'

  // Numéro WhatsApp cible
  const rawWhatsApp = config.donation_whatsapp_number || '+229 97 00 00 00'
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '')

  // Texte pré-rempli pour WhatsApp
  const methodNameMap = {
    mtn: 'MTN Mobile Money',
    moov: 'Moov Money (Flooz)',
    celtiis: 'Celtiis Cash',
    bank: 'Virement Bancaire (RIB)'
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour Trésorier du Club Rotaract de Cotonou Rive Gauche Cica !\n\n` +
    `Je viens d'effectuer un don de ${finalAmountString} via ${methodNameMap[paymentMethod]} pour soutenir "${currentCauseTitle}".\n\n` +
    `Je vous transmets ce message pour confirmation et remerciements associatifs.`
  )

  const whatsappLink = `https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`

  return (
    <div className="space-y-16">
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#014F43] via-[#00362d] to-[#012520] text-white p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C83A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E11A60]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-[#22C83A]">
            <Sparkles size={14} />
            <span>Rotaract Cotonou Rive Gauche Cica • Solidarité Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {config.donation_title || 'Chaque don transforme une vie au Bénin'}
          </h1>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-normal">
            {config.donation_subtitle || 'Grâce à votre générosité, nous menons des actions concrètes sur le terrain : santé, scolarité, accès à l’eau et autonomisation des jeunes.'}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#22C83A]" />
              <span>100% réinvesti sur le terrain</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <span>Affilié Rotary International</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-300" />
              <span>Transparence financière certifiée</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRILLE INTERACTIVE DE DON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLONNE GAUCHE (7 cols) : Étape 1 & Étape 2 */}
        <div className="lg:col-span-7 space-y-8">
          {/* ÉTAPE 1 : CHOIX DU MONTANT */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#014F43] text-white flex items-center justify-center text-sm font-black">
                1
              </span>
              <h2 className="text-xl font-black text-gray-900">
                Choisissez le montant de votre don
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = selectedAmount === preset.value
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset.value)
                      setCustomAmount('')
                    }}
                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#014F43] bg-[#014F43]/5 ring-2 ring-[#014F43]/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg font-black text-[#014F43]">
                        {preset.label}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#014F43] text-white flex items-center justify-center text-xs">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {preset.impact}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Montant personnalisé */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Ou saisissez un montant personnalisé (FCFA)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount('custom')
                  }}
                  onFocus={() => setSelectedAmount('custom')}
                  placeholder="Ex: 75 000"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-bold ${
                    selectedAmount === 'custom'
                      ? 'border-[#014F43] ring-2 ring-[#014F43]/20'
                      : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
                  FCFA
                </span>
              </div>
            </div>
          </div>

          {/* ÉTAPE 2 : CHOIX DE LA CAUSE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#014F43] text-white flex items-center justify-center text-sm font-black">
                2
              </span>
              <h2 className="text-xl font-black text-gray-900">
                Attribuez votre don à une cause
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAUSES.map((cause) => {
                const isSelected = selectedCause === cause.id
                return (
                  <button
                    key={cause.id}
                    type="button"
                    onClick={() => setSelectedCause(cause.id)}
                    className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'border-[#22C83A] bg-[#22C83A]/10 text-[#014F43] ring-1 ring-[#22C83A]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#22C83A] bg-[#22C83A]' : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{cause.title}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (5 cols) : Étape 3 (Moyens de paiement au Bénin) & WhatsApp */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#E11A60] text-white flex items-center justify-center text-sm font-black">
                3
              </span>
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Moyens de paiement au Bénin
                </h2>
                <p className="text-xs text-gray-500">Choisissez votre opérateur préféré</p>
              </div>
            </div>

            {/* Onglets des opérateurs */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-gray-100 rounded-2xl">
              {/* MTN */}
              <button
                type="button"
                onClick={() => setPaymentMethod('mtn')}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'mtn'
                    ? 'bg-amber-400 text-black shadow-sm scale-102'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="text-[10px] sm:text-xs">🟡 MTN</span>
              </button>

              {/* MOOV */}
              <button
                type="button"
                onClick={() => setPaymentMethod('moov')}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'moov'
                    ? 'bg-blue-600 text-white shadow-sm scale-102'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="text-[10px] sm:text-xs">🔵 MOOV</span>
              </button>

              {/* CELTIIS */}
              <button
                type="button"
                onClick={() => setPaymentMethod('celtiis')}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'celtiis'
                    ? 'bg-purple-700 text-white shadow-sm scale-102'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="text-[10px] sm:text-xs">🟣 CELTIIS</span>
              </button>

              {/* BANQUE */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'bank'
                    ? 'bg-[#014F43] text-white shadow-sm scale-102'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="text-[10px] sm:text-xs">🏛️ RIB</span>
              </button>
            </div>

            {/* DÉTAILS DE LA MÉTHODE CHOISIE */}
            <div className="rounded-2xl p-5 border border-gray-150 transition-all duration-300">
              {/* MTN MOMO */}
              {paymentMethod === 'mtn' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                      MTN Mobile Money (MoMo)
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Bénin
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Numéro officiel MoMo
                    </label>
                    <div className="flex items-center justify-between gap-2 mt-1 bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                      <span className="text-lg font-black text-gray-900 tracking-wider">
                        {config.donation_mtn_number || '97 00 00 00'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.donation_mtn_number || '97 00 00 00', 'mtn_num')}
                        className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 transition shadow-2xs cursor-pointer"
                      >
                        {copiedKey === 'mtn_num' ? (
                          <>
                            <Check size={14} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <strong>Titulaire :</strong> {config.donation_mtn_name || 'Rotaract Club de Cotonou Rive Gauche Cica'}
                    </p>
                    {config.donation_mtn_merchant_code && (
                      <p>
                        <strong>Code Marchand :</strong> {config.donation_mtn_merchant_code}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed border border-gray-150">
                    💡 <strong>Comment faire :</strong> {config.donation_mtn_instructions || 'Tapez *880# option 1 (Envoi d’argent), saisissez le numéro ci-dessus et le montant choisi.'}
                  </div>
                </div>
              )}

              {/* MOOV FLOOZ */}
              {paymentMethod === 'moov' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                      Moov Money (Flooz)
                    </span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Bénin
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Numéro officiel Flooz
                    </label>
                    <div className="flex items-center justify-between gap-2 mt-1 bg-blue-50/70 border border-blue-200 rounded-xl p-3">
                      <span className="text-lg font-black text-gray-900 tracking-wider">
                        {config.donation_moov_number || '95 00 00 00'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.donation_moov_number || '95 00 00 00', 'moov_num')}
                        className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition shadow-2xs cursor-pointer"
                      >
                        {copiedKey === 'moov_num' ? (
                          <>
                            <Check size={14} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <strong>Titulaire :</strong> {config.donation_moov_name || 'Rotaract Club de Cotonou Rive Gauche Cica'}
                    </p>
                    {config.donation_moov_merchant_code && (
                      <p>
                        <strong>Code Marchand :</strong> {config.donation_moov_merchant_code}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed border border-gray-150">
                    💡 <strong>Comment faire :</strong> {config.donation_moov_instructions || 'Tapez *855# option 1 (Transfert direct), saisissez le numéro ci-dessus et le montant souhaité.'}
                  </div>
                </div>
              )}

              {/* CELTIIS CASH */}
              {paymentMethod === 'celtiis' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
                      Celtiis Cash (SBIN)
                    </span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Bénin
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Numéro officiel Celtiis
                    </label>
                    <div className="flex items-center justify-between gap-2 mt-1 bg-purple-50/70 border border-purple-200 rounded-xl p-3">
                      <span className="text-lg font-black text-gray-900 tracking-wider">
                        {config.donation_celtiis_number || '40 00 00 00'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.donation_celtiis_number || '40 00 00 00', 'celtiis_num')}
                        className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-purple-700 text-white hover:bg-purple-600 transition shadow-2xs cursor-pointer"
                      >
                        {copiedKey === 'celtiis_num' ? (
                          <>
                            <Check size={14} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <strong>Titulaire :</strong> {config.donation_celtiis_name || 'Rotaract Club de Cotonou Rive Gauche Cica'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed border border-gray-150">
                    💡 <strong>Comment faire :</strong> {config.donation_celtiis_instructions || 'Tapez *888# ou transférez directement via l’application Celtiis Cash.'}
                  </div>
                </div>
              )}

              {/* VIREMENT BANCAIRE */}
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#014F43] tracking-wider">
                      Virement Bancaire (RIB)
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#014F43] px-2 py-0.5 rounded-full">
                      Banque locale & Internationale
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>
                      <strong>Banque :</strong> {config.donation_bank_name || 'Bank of Africa (BOA Bénin)'}
                    </p>
                    <p>
                      <strong>Titulaire :</strong> {config.donation_bank_account_name || 'CLUB ROTARACT DE COTONOU RIVE GAUCHE CICA'}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      RIB Bénin (24 caractères)
                    </label>
                    <div className="flex items-center justify-between gap-2 mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <span className="text-xs font-mono font-bold text-gray-800 break-all">
                        {config.donation_bank_rib || 'BJ061 01001 001234567890 12'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.donation_bank_rib || 'BJ061 01001 001234567890 12', 'bank_rib')}
                        className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-[#014F43] text-white hover:bg-[#00362d] transition shadow-2xs cursor-pointer flex-shrink-0"
                      >
                        {copiedKey === 'bank_rib' ? (
                          <>
                            <Check size={14} />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {config.donation_bank_iban && (
                    <div className="text-[11px] text-gray-500">
                      <strong>IBAN :</strong> {config.donation_bank_iban}{' '}
                      {config.donation_bank_swift && `• SWIFT : ${config.donation_bank_swift}`}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ÉTAPE 4 : CONFIRMATION VIA WHATSAPP */}
            <div className="pt-2 border-t border-gray-150 space-y-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 text-center cursor-pointer"
              >
                <MessageCircle size={20} className="fill-white" />
                <span>Confirmer mon don sur WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-gray-500 leading-normal">
                En cliquant, WhatsApp s&apos;ouvrira avec le récapitulatif pré-rempli pour notifier directement le trésorier du club.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION TRANSPARENCE & IMPACT */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#014F43]">
            Où va votre don ? Une transparence totale.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Au Club Rotaract de Cotonou Rive Gauche Cica, l’intégrité et la redevabilité sont au cœur de nos engagements rotariens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-150 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#014F43] text-white flex items-center justify-center font-bold">
              100%
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">Impact Terrain Direct</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vos dons sont intégralement affectés à l&apos;achat de fournitures, consommables médicaux, kits et matériel pour les bénéficiaires.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-150 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#22C83A] text-white flex items-center justify-center font-bold">
              📋
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">Rapports & Bilans Publics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Chaque action donne lieu à un compte-rendu d&apos;impact et des photos publiés en toute transparence sur notre site web.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-150 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E11A60] text-white flex items-center justify-center font-bold">
              📜
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">Reçu Associatif</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Sur simple demande auprès de la commission trésorerie, une attestation de don officielle signée vous est délivrée.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
