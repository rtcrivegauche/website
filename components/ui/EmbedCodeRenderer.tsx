'use client'

import { useEffect, useRef } from 'react'

interface EmbedCodeRendererProps {
  code: string
  className?: string
}

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void
    }
  }
}

export default function EmbedCodeRenderer({ code, className = '' }: EmbedCodeRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !code) return

    const trimmed = code.trim()

    // 1. Si l'utilisateur a simplement collé une URL brute (ex: https://tally.so/r/XXXXX ou https://forms.gle/...)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const isTally = trimmed.includes('tally.so')
      const targetSrc = isTally && !trimmed.includes('transparentBackground=1')
        ? `${trimmed}${trimmed.includes('?') ? '&' : '?'}transparentBackground=1&dynamicHeight=1`
        : trimmed

      containerRef.current.innerHTML = `
        <iframe 
          src="${targetSrc}" 
          width="100%" 
          height="600" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0" 
          title="Formulaire"
          style="border: none; width: 100%; min-height: 550px;"
        ></iframe>
      `
    } else {
      // 2. L'utilisateur a collé du HTML (iframe et/ou script)
      containerRef.current.innerHTML = trimmed
    }

    // Résoudre le cas spécifique des iframes Tally avec 'data-tally-src'
    const iframes = containerRef.current.querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]')
    iframes.forEach((iframe) => {
      if (!iframe.src && iframe.dataset.tallySrc) {
        iframe.src = iframe.dataset.tallySrc
      }
    })

    // Charger et exécuter le script officiel de Tally si présent ou si c'est un formulaire Tally
    if (trimmed.includes('tally.so')) {
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://tally.so/widgets/embed.js'
        script.async = true
        script.onload = () => {
          if (typeof window.Tally !== 'undefined') {
            window.Tally.loadEmbeds()
          }
        }
        document.body.appendChild(script)
      } else if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds()
      }
    }

    // Ré-exécuter les éventuels autres scripts contenus dans le code
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      // Éviter de doubler le script Tally déjà géré au-dessus
      if (oldScript.src && oldScript.src.includes('tally.so')) return
      
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
      newScript.appendChild(document.createTextNode(oldScript.innerHTML))
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [code])

  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-hidden ${className}`}
    />
  )
}
