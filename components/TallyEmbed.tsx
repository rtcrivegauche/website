'use client'

import { useEffect } from 'react'

interface TallyEmbedProps {
  formId: string
  mode?: 'full' | 'inline' | 'popup'
  transparentBackground?: boolean
  hideTitle?: boolean
  className?: string
}

export default function TallyEmbed({
  formId,
  mode = 'inline',
  transparentBackground = false,
  hideTitle = false,
  className = '',
}: TallyEmbedProps) {
  useEffect(() => {
    // Charger le script Tally
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Mode full page
  if (mode === 'full') {
    const params = new URLSearchParams()
    if (transparentBackground) params.append('transparentBackground', '1')
    if (hideTitle) params.append('hideTitle', '1')

    return (
      <div className="w-full h-screen">
        <iframe
          data-tally-src={`https://tally.so/r/${formId}?${params.toString()}`}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Formulaire Tally"
          className="absolute top-0 left-0 right-0 bottom-0 border-0"
        />
      </div>
    )
  }

  // Mode inline
  if (mode === 'inline') {
    const params = new URLSearchParams()
    if (transparentBackground) params.append('transparentBackground', '1')
    if (hideTitle) params.append('hideTitle', '1')

    return (
      <div className={className}>
        <iframe
          data-tally-src={`https://tally.so/embed/${formId}?${params.toString()}`}
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Formulaire Tally"
        />
      </div>
    )
  }

  // Mode popup (bouton)
  return (
    <button
      data-tally-open={formId}
      data-tally-emoji-text="👋"
      data-tally-emoji-animation="wave"
      className={className || 'px-6 py-3 bg-[#E11A60] text-white font-bold rounded-full hover:bg-[#c01550] transition-colors'}
    >
      Ouvrir le formulaire
    </button>
  )
}
