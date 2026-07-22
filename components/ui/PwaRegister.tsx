'use client'

import { useEffect } from 'react'

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker enregistré avec succès:', reg.scope))
        .catch((err) => console.error('Échec enregistrement Service Worker:', err))
    }
  }, [])

  return null
}
