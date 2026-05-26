"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar'
import { useEffect, useMemo } from 'react'

interface RichTextEditorProps {
  value: any // JSON structure ou HTML string
  onChange: (data: { json: any; html: string; text: string }) => void
  placeholder?: string
  editable?: boolean
  minHeight?: string
  error?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Commencez à rédiger votre contenu ici...',
  editable = true,
  minHeight = '240px',
  error
}: RichTextEditorProps) {
  
  // Analyser et normaliser le contenu initial
  const getInitialContent = () => {
    if (!value) return ''
    if (typeof value === 'object') return value
    
    // Si c'est une chaîne, vérifier si c'est du JSON sérialisé
    if (typeof value === 'string' && value.trim().startsWith('{')) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
    return value
  }

  // Mémoriser les extensions pour éviter les doublons au Fast Refresh de Next.js
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [2, 3, 4]
      }
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-rose-600 underline cursor-pointer hover:text-rose-700',
        rel: 'noopener noreferrer',
        target: '_blank'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-xl max-w-full my-6 shadow-md border border-gray-100 mx-auto block hover:opacity-95 transition-opacity'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Placeholder.configure({
      placeholder
    })
  ], [placeholder])

  const editor = useEditor({
    extensions,
    content: getInitialContent(),
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({
        json: editor.getJSON(),
        html: editor.getHTML(),
        text: editor.getText()
      })
    }
  })

  // Mettre à jour le contenu de l'éditeur si la valeur externe change (ex: réinitialisation du formulaire)
  useEffect(() => {
    if (!editor) return
    const currentHTML = editor.getHTML()
    
    // Si la valeur externe est vide et l'éditeur a du contenu
    if (!value && currentHTML !== '<p></p>') {
      editor.commands.setContent('')
      return
    }
    
    // Éviter les boucles infinies de mise à jour en comparant grossièrement le HTML
    if (typeof value === 'string' && value !== currentHTML && !value.trim().startsWith('{')) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="flex flex-col">
      <div className={`border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all bg-white shadow-sm`}>
        <EditorToolbar editor={editor} />
        <div 
          className="prose prose-sm prose-rose max-w-none p-4 overflow-y-auto outline-none"
          style={{ minHeight }}
        >
          <style jsx global>{`
            .ProseMirror {
              outline: none;
              min-height: inherit;
            }
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #adb5bd;
              pointer-events: none;
              height: 0;
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 pl-1">{error}</span>
      )}
    </div>
  )
}
