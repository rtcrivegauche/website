import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Users } from 'lucide-react'

export default async function MembresPage() {
  const supabase = await createClient()
  
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('is_active', true)
    .order('full_name')

  const commissions = [...new Set(members?.map(m => m.commission).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={32} />
            <h1 className="text-4xl md:text-5xl font-bold">Nos Membres</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Découvrez les Rotaractiens et Rotaractiennes qui font vivre notre club
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un membre
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Nom, prénom..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#014F43] focus:border-transparent">
                <option value="">Toutes les commissions</option>
                {commissions.map(commission => (
                  <option key={commission} value={commission}>{commission}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des membres */}
      <section className="max-w-[1320px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members?.map((member) => (
            <Link
              key={member.id}
              href={`/membres/${member.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-64 bg-gray-100">
                {member.photo_url && (
                  <Image
                    src={member.photo_url}
                    alt={member.full_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#014F43] mb-1">
                  {member.full_name}
                </h3>
                {member.role_title && (
                  <p className="text-sm text-[#E11A60] font-medium mb-1">
                    {member.role_title}
                  </p>
                )}
                {member.professional_title && (
                  <p className="text-sm text-gray-600">
                    {member.professional_title}
                  </p>
                )}
                {member.commission && (
                  <p className="text-xs text-gray-500 mt-2">
                    {member.commission}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {!members || members.length === 0 && (
          <div className="text-center py-16">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Aucun membre trouvé</p>
          </div>
        )}
      </section>
    </div>
  )
}
