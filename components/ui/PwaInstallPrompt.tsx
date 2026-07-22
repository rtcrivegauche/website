'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà dans l'application PWA installée
    const isStandalone = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )

    if (isStandalone) {
      setShowPrompt(false)
      return
    }

    // Écouter l'événement d'installation PWA native
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Vérifier si l'utilisateur n'a pas fermé la bannière récemment
      const dismissedTime = localStorage.getItem('pwa_prompt_dismissed')
      const isInstalled = localStorage.getItem('pwa_installed') === 'true'

      if (!isInstalled && (!dismissedTime || Date.now() - parseInt(dismissedTime) > 86400000 * 3)) {
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('Installation PWA acceptée par l\'utilisateur')
      localStorage.setItem('pwa_installed', 'true')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#014F43] text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white p-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <img src="/icons/favicon-rtc-rgc.png" alt="Club Rotaract Cica" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm leading-tight">Installer l'application RTC Cica</h4>
            <p className="text-xs text-white/80 mt-0.5">Accédez au dashboard et au site en un clic</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#014F43] hover:bg-gray-100 rounded-xl text-xs font-bold transition shadow-md"
          >
            <Download size={14} />
            <span>Installer</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
