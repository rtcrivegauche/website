'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Check, Heart, MessageCircle, Phone, Sparkles } from 'lucide-react'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  phone?: string | null
}

export default function DonationModal({ isOpen, onClose, phone }: DonationModalProps) {
  const [copied, setCopied] = useState(false)

  // Numéro configuré en backend dans site_config (téléphone de contact)
  const displayPhone = phone || '+229 97 00 00 00'
  const cleanPhone = displayPhone.replace(/[^0-9]/g, '')

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayPhone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Je souhaite faire un don pour soutenir les actions du Club Rotaract de Cotonou Rive Gauche Cica.`
  )
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      {/* Arrière-plan avec flou */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Carte du Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* En-tête avec animation douce */}
        <div className="pt-8 pb-4 px-6 text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            {/* Anneau pulsant doux */}
            <div className="absolute w-20 h-20 rounded-full bg-[#E11A60]/15 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#E11A60] to-rose-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Heart className="w-8 h-8 fill-white animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-[#014F43]">
              Faire un Don
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              Chaque contribution permet de financer directement nos actions solidaires sur le terrain au Bénin.
            </p>
          </div>
        </div>

        {/* Corps : Affichage clair du numéro Mobile Money */}
        <div className="p-6 pt-2 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 text-center space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block">
              Numéro officiel de réception (Mobile Money)
            </span>

            {/* Numéro en grand */}
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-wider font-mono">
              {displayPhone}
            </div>

            <p className="text-[11px] text-gray-500">
              Compatible <strong>MTN MoMo</strong>, <strong>Moov Flooz</strong> &amp; <strong>Celtiis Cash</strong>
            </p>

            {/* Bouton Copier */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#014F43] hover:bg-[#00362d] text-white transition shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-300" />
                    <span>Numéro copié !</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copier le numéro</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bouton WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition shadow-md cursor-pointer"
          >
            <MessageCircle size={17} className="fill-white" />
            <span>Confirmer ou écrire sur WhatsApp</span>
          </a>

          <p className="text-[11px] text-center text-gray-400">
            Envoyez simplement le montant de votre choix à ce numéro. Merci pour votre générosité !
          </p>
        </div>
      </div>
    </div>
  )
}
