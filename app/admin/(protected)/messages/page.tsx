"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Calendar, 
  Phone, 
  User, 
  ExternalLink,
  ChevronRight,
  Inbox,
  Loader2
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'new' | 'read'
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all')

  const supabase = createClient()

  const fetchMessages = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'new') {
        query = query.eq('status', 'new')
      } else if (filter === 'read') {
        query = query.eq('status', 'read')
      }

      const { data, error } = await query

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg)
    if (msg.status === 'new') {
      // Marquer automatiquement comme lu lors de l'ouverture
      await toggleStatus(msg.id, 'read')
    }
  }

  const toggleStatus = async (id: string, newStatus: 'new' | 'read') => {
    setActionLoading(id)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Mettre à jour l'état local
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    setActionLoading(id)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessages(prev => prev.filter(m => m.id !== id))
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
          <p className="text-sm text-gray-500 mt-1">Lisez et répondez aux messages envoyés par les visiteurs du site</p>
        </div>

        {/* Filtres de statut */}
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${filter === 'all' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Tous ({filter === 'all' ? messages.length : '...'})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${filter === 'new' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Nouveaux
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${filter === 'read' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Lus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Liste des messages (Lg: col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[650px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Boîte de réception</span>
            <button 
              onClick={fetchMessages} 
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
              disabled={loading}
            >
              Rafraîchir
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin text-rose-500" size={24} />
                <span className="text-xs">Chargement des messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3 text-center">
                <Inbox size={32} className="text-gray-300" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-700">Aucun message</span>
                  <span className="text-xs text-gray-400">Votre boîte de réception est vide</span>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-rose-50/20 transition-all flex flex-col gap-1.5 relative border-l-4 ${
                      msg.status === 'new' 
                        ? 'border-l-rose-500 font-semibold bg-rose-50/10' 
                        : isSelected ? 'border-l-rose-300 bg-gray-50/30' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm truncate pr-2 ${msg.status === 'new' ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-rose-700 truncate">
                      {msg.subject}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </div>

                    {msg.status === 'new' && (
                      <span className="absolute top-4 right-12 w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Détails du message sélectionné (Lg: col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Entête détails */}
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>Reçu le {formatDate(selectedMessage.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(selectedMessage.id, selectedMessage.status === 'read' ? 'new' : 'read')}
                    disabled={actionLoading === selectedMessage.id}
                    className={`p-2 rounded-lg border transition ${
                      selectedMessage.status === 'read'
                        ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        : 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100'
                    }`}
                    title={selectedMessage.status === 'read' ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    {selectedMessage.status === 'read' ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    disabled={actionLoading === selectedMessage.id}
                    className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Supprimer le message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expéditeur */}
              <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{selectedMessage.name}</span>
                    <span className="text-xs text-gray-500">Expéditeur</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 justify-center md:items-end">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    {selectedMessage.email}
                    <ExternalLink size={12} />
                  </a>
                  {selectedMessage.phone && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={12} />
                      {selectedMessage.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Corps du message */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100 shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <MailOpen size={14} />
                  Répondre par Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-8 text-center bg-gray-50/10">
              <Mail size={40} className="text-gray-300" />
              <div className="flex flex-col gap-0.5 max-w-xs">
                <span className="text-sm font-semibold text-gray-700">Sélectionnez un message</span>
                <span className="text-xs text-gray-400">Cliquez sur un message de la liste pour lire son contenu détaillé</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
