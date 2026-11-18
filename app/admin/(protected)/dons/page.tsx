import { createClient } from '@/lib/supabase/server'
import DonationConfigForm from '@/components/admin/DonationConfigForm'
import { HeartHandshake, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDonsPage() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#014F43] text-white rounded-xl">
              <HeartHandshake size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Gestion des Dons & Numéros de Paiement
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            Définissez ici les coordonnées officielles (MTN MoMo, Moov Flooz, Celtiis Cash, Compte Bancaire) pour recevoir les dons.
          </p>
        </div>

        <Link
          href="/faire-un-don"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-[#014F43] hover:border-[#014F43] text-xs font-bold transition shadow-xs"
        >
          <Eye size={15} />
          <span>Voir la page publique</span>
        </Link>
      </div>

      <DonationConfigForm config={config || {}} />
    </div>
  )
}
