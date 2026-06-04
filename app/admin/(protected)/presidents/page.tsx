import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit2, Users, Star } from 'lucide-react'

export const metadata = {
  title: 'Gestion des Présidents - Administration',
  description: 'Gérez la liste des présidents de mandat et éditez le mot du Président de la page d\'accueil.',
}

export default async function PresidentsAdminPage() {
  const supabase = await createClient()

  const { data: presidents, error } = await supabase
    .from('presidents')
    .select('*')
    .order('term', { ascending: false })

  if (error) {
    console.error('Error fetching presidents:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Présidents & Mandats</h1>
          <p className="text-gray-500 mt-1">
            Gérez les présidents et éditez le mot du Président affiché sur la page d'accueil pour le mandat en cours.
          </p>
        </div>
        <Link
          href="/admin/presidents/nouveau"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Ajouter un président
        </Link>
      </div>

      {!presidents || presidents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-12 text-center max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto text-gray-400 mb-4">
            <Users size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun président enregistré</h3>
          <p className="text-gray-500 mb-6">
            Ajoutez le premier président du club et configurez son message d'accueil.
          </p>
          <Link
            href="/admin/presidents/nouveau"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all"
          >
            <Plus size={20} />
            Créer un président
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidents.map((p) => (
            <div 
              key={p.id} 
              className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative ${
                p.is_current ? 'border-2 border-[#E11A60]' : 'border-gray-150'
              }`}
            >
              {/* Statut Président Actuel */}
              {p.is_current && (
                <span className="absolute top-4 right-4 bg-[#E11A60] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Star size={10} className="fill-white" />
                  Mandat En Cours
                </span>
              )}

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center font-black text-[#014F43] text-xl uppercase flex-shrink-0">
                    {p.photo_url ? (
                      <Image src={p.photo_url} alt={p.full_name} fill className="object-cover" />
                    ) : (
                      p.full_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#014F43] text-lg leading-tight">{p.full_name}</h4>
                    <p className="text-xs font-bold text-[#E11A60] uppercase tracking-wider">{p.term}</p>
                  </div>
                </div>

                <p className="text-gray-600 italic text-sm leading-relaxed mb-6 line-clamp-5 border-t border-gray-100 pt-4">
                  « {p.message} »
                </p>
              </div>

              <div className="flex items-center justify-end border-t border-gray-100 pt-4 mt-auto">
                <Link
                  href={`/admin/presidents/${p.id}`}
                  className="p-2.5 bg-gray-55 hover:bg-[#014F43] text-gray-500 hover:text-white rounded-xl transition-all border border-gray-200 flex items-center gap-1.5 text-xs font-bold"
                  title="Modifier ce président"
                >
                  <Edit2 size={14} />
                  Modifier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
