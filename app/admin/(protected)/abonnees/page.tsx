import { createClient } from '@/lib/supabase/server'
import { Calendar, Mail, Phone, User, Trash2 } from 'lucide-react'
import SubscriberRow from './components/SubscriberRow'

export const metadata = {
  title: 'Abonnés Newsletter - Administration',
  description: 'Liste des personnes inscrites aux canaux de diffusion (WhatsApp, Email) du club.',
}

export default async function NewsletterSubscribersPage() {
  const supabase = await createClient()

  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subscribers:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Abonnés Newsletter</h1>
          <p className="text-gray-500 mt-1">
            Gérez la liste de contacts inscrits via notre pop-up d'informations (Emails et WhatsApp).
          </p>
        </div>
      </div>

      {!subscribers || subscribers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-12 text-center max-w-2xl mx-auto">
          <div className="p-4 bg-gray-55 rounded-full w-fit mx-auto text-gray-400 mb-4">
            <Mail size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun abonné enregistré</h3>
          <p className="text-gray-500">
            Dès que des visiteurs s'inscriront sur la page d'accueil, leurs coordonnées s'afficheront ici en temps réel.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-55 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Abonné</th>
                  <th className="px-6 py-4">Adresse Email</th>
                  <th className="px-6 py-4">Numéro WhatsApp</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {subscribers.map((subscriber) => (
                  <SubscriberRow key={subscriber.id} subscriber={subscriber} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
