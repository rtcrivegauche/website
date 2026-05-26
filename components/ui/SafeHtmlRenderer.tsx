"use client"

import { useEffect, useState } from 'react'
import dompurify from 'dompurify'

interface SafeHtmlRendererProps {
  html: string
  className?: string
}

export default function SafeHtmlRenderer({ html, className = '' }: SafeHtmlRendererProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')

  useEffect(() => {
    if (!html) {
      setSanitizedHtml('')
      return
    }
    // Purifier uniquement côté client pour éviter les erreurs d'hydratation / window indefini
    const clean = dompurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h2', 'h3', 'h4', 
        'ul', 'ol', 'li', 'blockquote', 'a', 'img'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class']
    })
    setSanitizedHtml(clean)
  }, [html])

  return (
    <div 
      className={`prose prose-rose max-w-none text-gray-700 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml || '' }}
    />
  )
}
