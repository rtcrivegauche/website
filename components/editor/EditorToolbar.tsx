"use client"

import { Editor } from '@tiptap/react'
import { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  // Insertion de lien
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Entrez l\'URL du lien :', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // Upload d'image local -> R2
  const handleImageUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entityType', 'editor')

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload de l\'image.')
      }

      if (data.image_url) {
        editor.chain().focus().setImage({ src: data.image_url, alt: file.name }).run()
      }
    } catch (error: any) {
      console.error("Erreur d'upload d'image Tiptap:", error)
      alert(error.message || "Impossible de charger l'image.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-700"
        title="Annuler"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-700"
        title="Rétablir"
      >
        <Redo size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-1 align-self-center my-auto" />

      {/* Titres */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Titre 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Titre 3"
      >
        <Heading3 size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-1 align-self-center my-auto" />

      {/* Formatage de base */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('bold') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Gras"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('italic') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Italique"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('underline') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Souligné"
      >
        <Underline size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('strike') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Barré"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-1 align-self-center my-auto" />

      {/* Alignements */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Aligner à gauche"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Aligner au centre"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Aligner à droite"
      >
        <AlignRight size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Justifier"
      >
        <AlignJustify size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-1 align-self-center my-auto" />

      {/* Listes et Blocs */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('bulletList') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Liste à puces"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('orderedList') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Liste numérotée"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded text-gray-700 ${editor.isActive('blockquote') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Citation"
      >
        <Quote size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-1 align-self-center my-auto" />

      {/* Liens et Images */}
      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded text-gray-700 ${editor.isActive('link') ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-200'}`}
        title="Ajouter un lien"
      >
        <Link size={16} />
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleImageUploadClick}
        disabled={isUploading}
        className="p-2 hover:bg-gray-200 rounded text-gray-700 disabled:opacity-50 flex items-center gap-1"
        title="Insérer une image"
      >
        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
      </button>
    </div>
  )
}
