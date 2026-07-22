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
        'p', 'br', 'span', 'div', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 
        'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'hr', 'figure', 'figcaption', 'iframe'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'class', 'style', 
        'width', 'height', 'align', 'valign', 'colspan', 'rowspan', 'frameborder', 'allowfullscreen'
      ]
    })
    setSanitizedHtml(clean)
  }, [html])

  return (
    <div 
      className={`tiptap-rendered-content prose prose-rose max-w-none text-gray-800 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml || '' }}
    />
  )
}
