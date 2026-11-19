"use client"

import { useEffect, useState } from 'react'
import dompurify from 'dompurify'

interface SafeHtmlRendererProps {
  html: any
  className?: string
}

function extractHtmlString(raw: any): string {
  if (!raw) return ''
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === '[object Object]' || trimmed === 'null' || trimmed === 'undefined') return ''
    if (trimmed.includes('[object Object]')) {
      return trimmed.replace(/\[object Object\]/g, '').trim()
    }
    return trimmed
  }
  if (typeof raw === 'object' && raw !== null) {
    if (typeof raw.html === 'string') return extractHtmlString(raw.html)
    if (typeof raw.html === 'object') return extractHtmlString(raw.html)
    if (typeof raw.content === 'string') return extractHtmlString(raw.content)
  }
  return ''
}

export default function SafeHtmlRenderer({ html, className = '' }: SafeHtmlRendererProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')

  useEffect(() => {
    const rawString = extractHtmlString(html)
    if (!rawString) {
      setSanitizedHtml('')
      return
    }

    // Si le contenu n'est que des balises vides (ex: <p></p> ou espaces)
    const stripped = rawString.replace(/<[^>]*>/g, '').trim()
    if (!stripped && !rawString.includes('<img') && !rawString.includes('<iframe')) {
      setSanitizedHtml('')
      return
    }

    // Purifier uniquement côté client pour éviter les erreurs d'hydratation / window indefini
    const clean = dompurify.sanitize(rawString, {
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

    if (!clean || clean === '[object Object]' || clean.includes('[object Object]')) {
      setSanitizedHtml('')
    } else {
      setSanitizedHtml(clean)
    }
  }, [html])

  if (!sanitizedHtml) return null

  return (
    <div 
      className={`tiptap-rendered-content prose prose-rose max-w-none text-gray-800 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
