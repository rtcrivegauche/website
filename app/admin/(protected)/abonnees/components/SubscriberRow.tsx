'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Mail, Phone, User, Trash2 } from 'lucide-react'

type Subscriber = {
  id: string
  first_name: string
  email: string
  whatsapp_number: string | null
  created_at: string
}

export default function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Supprimer l'abonné ${subscriber.first_name} (${subscriber.email}) ?`)) {
      return
    }

    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriber.id)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'abonné:', err)
      alert('Une erreur est survenue lors de la suppression : ' + (err.message || err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="hover:bg-gray-55/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#014F43]/10 text-[#014F43] rounded-full">
            <User size={16} />
          </div>
          <span className="font-bold text-gray-900">{subscriber.first_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-gray-400" />
          <a href={`mailto:${subscriber.email}`} className="hover:text-[#014F43] hover:underline font-medium">
            {subscriber.email}
          </a>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600">
        {subscriber.whatsapp_number ? (
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-gray-400" />
            <a 
              href={`https://wa.me/${subscriber.whatsapp_number.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-green-600 hover:underline font-medium"
            >
              {subscriber.whatsapp_number}
            </a>
          </div>
        ) : (
          <span className="text-gray-400 italic">Non fourni</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-gray-400" />
          {new Date(subscriber.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Supprimer l'abonné de la liste"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )
}
