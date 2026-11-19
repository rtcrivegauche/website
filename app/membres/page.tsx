export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import MembersDirectory from '@/components/public/MembersDirectory'
import { Users } from 'lucide-react'

export const metadata = {
  title: 'Nos Membres & Membres d\'Honneur - Rotaract Cotonou Rive Gauche Cica',
  description: 'Découvrez les Rotaractiens, Rotaractiennes et personnalités d\'honneur qui font grandir notre club.',
}

export default async function MembresPage() {
  const supabase = await createClient()
  
  // Charger les membres et les mandats en parallèle de manière 100% tolérante
  const [membersRes, presidentsRes] = await Promise.all([
    supabase
      .from('members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('full_name'),
    supabase
      .from('presidents')
      .select('id, member_id, full_name, term, theme, is_current')
  ])

  // Indexer les mandats par member_id et par nom normalisé pour assurer la liaison
  const mandatesByMemberId = new Map<string, any[]>()
  const mandatesByName = new Map<string, any[]>()

  if (presidentsRes.data) {
    for (const p of presidentsRes.data) {
      if (p.member_id) {
        const list = mandatesByMemberId.get(p.member_id) || []
        list.push(p)
        mandatesByMemberId.set(p.member_id, list)
      }
      const norm = (p.full_name || '').trim().toLowerCase()
      if (norm) {
        const list = mandatesByName.get(norm) || []
        list.push(p)
        mandatesByName.set(norm, list)
      }
    }
  }

  const validMembers = (membersRes.data || []).map((m) => {
    const norm = (m.full_name || '').trim().toLowerCase()
    const mandates = mandatesByMemberId.get(m.id) || mandatesByName.get(norm) || []
    return {
      ...m,
      presidency_mandates: mandates
    }
  })

  const commissions = [...new Set(validMembers.map((m) => m.commission).filter(Boolean))] as string[]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-14 md:py-20">
          <div className="max-w-[1320px] mx-auto px-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Users size={16} />
              <span>Trombinoscope & Comité d&apos;Honneur</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Nos Membres
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              Découvrez les Rotaractiens dévoués et les Membres d&apos;Honneur qui accompagnent et font rayonner notre club.
            </p>
          </div>
        </section>

        {/* Annuaire interactif avec onglets & cartes VIP */}
        <section className="max-w-[1320px] mx-auto px-6 py-12 md:py-16">
          <MembersDirectory members={validMembers} commissions={commissions} />
        </section>
      </main>
      <Footer />
    </div>
  )
}
