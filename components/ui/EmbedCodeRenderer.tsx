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

/**
 * Nettoie et transforme une URL Tally pour un affichage embed optimal :
 * - Convertit /r/ en /embed/
 * - Ajoute hideTitle=1 (évite le titre en double avec le titre de la page)
 * - Ajoute dynamicHeight=1 et transparentBackground=1
 */
function normalizeTallyUrl(rawUrl: string): string {
  let url = rawUrl.trim()
  
  // Remplacer tally.so/r/ par tally.so/embed/
  url = url.replace(/tally\.so\/r\//i, 'tally.so/embed/')

  // S'assurer que c'est bien une URL embed si c'est du Tally
  if (!url.includes('tally.so/embed/')) {
    url = url.replace(/tally\.so\//i, 'tally.so/embed/')
  }

  // Ajouter les paramètres requis
  const hasParams = url.includes('?')
  const glue = hasParams ? '&' : '?'
  
  const paramsToAdd: string[] = []
  if (!url.includes('alignLeft=')) paramsToAdd.push('alignLeft=1')
  if (!url.includes('hideTitle=')) paramsToAdd.push('hideTitle=1')
  if (!url.includes('transparentBackground=')) paramsToAdd.push('transparentBackground=1')
  if (!url.includes('dynamicHeight=')) paramsToAdd.push('dynamicHeight=1')

  if (paramsToAdd.length > 0) {
    url += `${glue}${paramsToAdd.join('&')}`
  }

  return url
}

export default function EmbedCodeRenderer({ code, className = '' }: EmbedCodeRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !code) return

    const trimmed = code.trim()

    // 1. Si l'utilisateur a collé une simple URL brute (ex: https://tally.so/r/2jA9zL ou google forms)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const isTally = trimmed.includes('tally.so')
      const targetSrc = isTally ? normalizeTallyUrl(trimmed) : trimmed

      containerRef.current.innerHTML = `
        <iframe 
          data-tally-src="${targetSrc}"
          src="${targetSrc}" 
          width="100%" 
          height="900" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0" 
          title="Formulaire"
          style="border: none; width: 100%; min-height: 850px; display: block;"
        ></iframe>
      `
    } else {
      // 2. L'utilisateur a collé du HTML (iframe et/ou script)
      let processedHtml = trimmed

      // Si l'iframe contient tally.so, on transforme les /r/ en /embed/ et on injecte hideTitle=1
      if (processedHtml.includes('tally.so')) {
        processedHtml = processedHtml.replace(/https?:\/\/tally\.so\/r\/([a-zA-Z0-9_-]+)/g, (match, id) => {
          return normalizeTallyUrl(`https://tally.so/embed/${id}`)
        })
      }

      containerRef.current.innerHTML = processedHtml

      // S'assurer que les iframes ont une hauteur minimale généreuse pour ne rien tronquer
      const iframes = containerRef.current.querySelectorAll<HTMLIFrameElement>('iframe')
      iframes.forEach((iframe) => {
        iframe.style.width = '100%'
        if (!iframe.style.minHeight || parseInt(iframe.style.minHeight) < 700) {
          iframe.style.minHeight = '850px'
        }
        if (!iframe.getAttribute('height') || parseInt(iframe.getAttribute('height') || '0') < 700) {
          iframe.setAttribute('height', '900')
        }
        iframe.style.border = 'none'

        // Si l'iframe est Tally, optimiser l'URL
        const src = iframe.src || iframe.getAttribute('data-tally-src') || ''
        if (src.includes('tally.so')) {
          const optimized = normalizeTallyUrl(src)
          iframe.src = optimized
          iframe.setAttribute('data-tally-src', optimized)
        }
      })
    }

    // Résoudre le cas spécifique des iframes Tally avec 'data-tally-src'
    const tallyIframes = containerRef.current.querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]')
    tallyIframes.forEach((iframe) => {
      if (!iframe.src && iframe.dataset.tallySrc) {
        iframe.src = normalizeTallyUrl(iframe.dataset.tallySrc)
      }
    })

    // Charger et exécuter le script officiel de Tally si c'est un formulaire Tally
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

    // Écouter les messages de redimensionnement dynamique de Tally
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data && typeof data === 'object') {
          const eventName = data.event || ''
          const height = data.payload?.height || data.height
          if (typeof eventName === 'string' && eventName.startsWith('Tally.') && typeof height === 'number' && height > 0) {
            const iframes = containerRef.current?.querySelectorAll('iframe')
            iframes?.forEach((iframe) => {
              const targetHeight = Math.max(height + 40, 800)
              iframe.style.height = `${targetHeight}px`
              iframe.style.minHeight = `${targetHeight}px`
            })
          }
        }
      } catch {
        // Ignorer les messages tiers
      }
    }

    window.addEventListener('message', handleMessage)

    // Ré-exécuter les éventuels autres scripts contenus dans le code
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      if (oldScript.src && oldScript.src.includes('tally.so')) return
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
      newScript.appendChild(document.createTextNode(oldScript.innerHTML))
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [code])

  return (
    <div 
      ref={containerRef} 
      className={`w-full min-h-[850px] transition-all duration-300 ${className}`}
    />
  )
}
