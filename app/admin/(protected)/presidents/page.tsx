import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit2, Users, Star, Award, Sparkles, Briefcase, Eye } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'
import ReorderRowButtons from '@/components/admin/ReorderRowButtons'

export const metadata = {
  title: 'Gestion des Présidents - Administration',
  description: 'Gérez la liste des présidents de mandat et des anciens présidents (Past-Presidents).',
}

export default async function PresidentsAdminPage() {
  const supabase = await createClient()

  const [presidentsRes, membersRes] = await Promise.all([
    supabase
      .from('presidents')
      .select('*')
      .order('display_order', { ascending: true })
      .order('term', { ascending: false }),
    supabase
      .from('members')
      .select('id, full_name')
  ])

  const presidents = presidentsRes.data || []
  const membersMap = new Map<string, string>()
  membersRes.data?.forEach((m: any) => membersMap.set(m.id, m.full_name))

  const allIds = presidents?.map((p) => p.id) || []

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#014F43] text-white rounded-xl">
              <Award size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Présidents &amp; Past-Présidents
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Gérez l&apos;historique des mandats, le mot du président actuel et les profils complets des anciens présidents du club.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/past-presidents"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-[#014F43] hover:border-[#014F43] text-xs font-bold transition shadow-xs"
          >
            <Eye size={15} />
            <span>Voir la page publique</span>
          </Link>

          <Link
            href="/admin/presidents/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#014F43] hover:bg-[#00362d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow-md text-center"
          >
            <Plus size={18} />
            <span>Ajouter un président</span>
          </Link>
        </div>
      </div>

      {!presidents || presidents.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-150 p-12 text-center max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto text-gray-400 mb-4">
            <Users size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun président enregistré</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Ajoutez le premier président du club et configurez son mandat et ses accomplissements.
          </p>
          <Link
            href="/admin/presidents/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all text-sm"
          >
            <Plus size={18} />
            Créer un président
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidents.map((p, index) => (
            <div 
              key={p.id} 
              className={`bg-white rounded-3xl border shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative ${
                p.is_current ? 'border-2 border-[#E11A60] ring-2 ring-[#E11A60]/10' : 'border-gray-200'
              }`}
            >
              {/* Statut Badge */}
              <div className="absolute top-4 right-4">
                {p.is_current ? (
                  <span className="bg-[#E11A60] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Star size={10} className="fill-white" />
                    Mandat Actuel
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Past-Président
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center font-black text-[#014F43] text-xl uppercase flex-shrink-0">
                    {p.photo_url ? (
                      <Image src={p.photo_url} alt={p.full_name} fill className="object-cover" />
                    ) : (
                      p.full_name.charAt(0)
                    )}
                  </div>
                  <div className="pr-20">
                    <h4 className="font-extrabold text-[#014F43] text-base leading-tight">{p.full_name}</h4>
                    <p className="text-xs font-bold text-[#E11A60] uppercase tracking-wider mt-0.5">{p.term}</p>
                    {(() => {
                      const linkedName = p.member_id ? membersMap.get(p.member_id) : null
                      if (linkedName) {
                        return (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                            <Users size={10} />
                            <span>Lié au membre : {linkedName}</span>
                          </span>
                        )
                      }
                      return (
                        <span className="inline-block text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 mt-1">
                          Mandat autonome
                        </span>
                      )
                    })()}
                  </div>
                </div>

                {/* Thème du mandat */}
                {p.theme && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <Sparkles size={13} className="text-amber-600 flex-shrink-0" />
                    <span className="truncate">Thème : {p.theme}</span>
                  </div>
                )}

                {/* Profession & Entreprise */}
                {(p.professional_title || p.company) && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <Briefcase size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {p.professional_title}
                      {p.company && ` • ${p.company}`}
                    </span>
                  </div>
                )}

                <p className="text-gray-600 italic text-xs leading-relaxed mb-6 line-clamp-4 border-t border-gray-100 pt-3">
                  « {p.message} »
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <ReorderRowButtons
                  table="presidents"
                  itemId={p.id}
                  currentIndex={index}
                  allIds={allIds}
                  revalidatePath="/admin/presidents"
                />
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/presidents/${p.id}`}
                    className="p-2.5 bg-gray-50 hover:bg-[#014F43] text-gray-500 hover:text-white rounded-xl transition-all border border-gray-200 flex items-center gap-1.5 text-xs font-bold"
                    title="Modifier ce président"
                  >
                    <Edit2 size={14} />
                    Modifier
                  </Link>
                  <DeleteButton
                    table="presidents"
                    id={p.id}
                    itemName={p.full_name}
                    variant="button"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
