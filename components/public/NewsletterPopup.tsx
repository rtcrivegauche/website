'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, X, CheckCircle, MessageSquare } from 'lucide-react'

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    whatsapp: ''
  })

  useEffect(() => {
    // Écouter la touche Échap pour fermer la pop-up
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Vérifier si l'utilisateur a déjà souscrit ou fermé la pop-up
    const hasSubscribed = localStorage.getItem('newsletter_subscribed')
    
    if (!hasSubscribed) {
      // Déclencher l'ouverture après 6 secondes d'inactivité
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 6000)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Enregistrer temporairement pour ne pas importuner l'utilisateur pendant cette session
    localStorage.setItem('newsletter_subscribed', 'dismissed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          whatsappNumber: formData.whatsapp || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setSuccess(true)
      localStorage.setItem('newsletter_subscribed', 'true')
      
      // Fermer automatiquement après 4 secondes de succès
      setTimeout(() => {
        setIsOpen(false)
      }, 4000)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm px-4 md:px-0 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white rounded-[32px] border border-gray-200 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#014F43]/5 rounded-full pointer-events-none"></div>

        {/* Bouton fermer réactif et facile à cliquer */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 bg-gray-100 hover:bg-[#E11A60] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 z-50 cursor-pointer shadow-sm hover:scale-110 active:scale-95"
          title="Fermer la fenêtre"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Merci pour votre inscription !</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Vous êtes désormais abonné à nos alertes et notifications. Vous serez notifié à chaque nouvel album ou rapport !
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Titre */}
            <div className="flex items-center gap-2 text-[#E11A60] font-bold text-xs uppercase tracking-wider mb-1">
              <Bell size={14} className="animate-bounce" />
              <span>Restez informé</span>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-[#014F43] leading-tight">
                Ne manquez aucune action !
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Soyez alerté en direct à chaque publication de nouvel album photo, rapport de réunion ou événement marquant du club.
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            {/* Inputs */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Votre prénom *"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-xs"
              />
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="email"
                  placeholder="Votre adresse email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-xs"
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="tel"
                  placeholder="Numéro WhatsApp (optionnel)"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#014F43] hover:bg-[#E11A60] text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'abonner aux alertes"}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
