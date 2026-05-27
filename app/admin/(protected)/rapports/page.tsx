import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Calendar, FileText, Globe, EyeOff, Trash2 } from 'lucide-react'

export const metadata = {
  title: 'Gestion des Rapports - Administration',
  description: 'Gérez les rapports de réunions et comptes-rendus officiels du club.',
}

export default async function RapportsAdminPage() {
  const supabase = await createClient()

  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('meeting_date', { ascending: false })

  if (error) {
    console.error('Error fetching reports:', error)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rapports de Réunions</h1>
          <p className="text-gray-500 mt-1">
            Gérez les comptes-rendus officiels et les documents PDF des réunions du club.
          </p>
        </div>
        <Link
          href="/admin/rapports/nouveau"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Ajouter un rapport
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-12 text-center max-w-2xl mx-auto">
          <div className="p-4 bg-gray-55 rounded-full w-fit mx-auto text-gray-400 mb-4">
            <FileText size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun rapport enregistré</h3>
          <p className="text-gray-500 mb-6">
            Publiez des comptes-rendus complets pour informer les membres et visiteurs de nos activités et décisions.
          </p>
          <Link
            href="/admin/rapports/nouveau"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#014F43] hover:bg-[#00362d] text-white font-bold rounded-xl transition-all"
          >
            <Plus size={20} />
            Créer votre premier rapport
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Titre du rapport</th>
                  <th className="px-6 py-4">Date de Réunion</th>
                  <th className="px-6 py-4">PDF Officiel</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-55/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 line-clamp-1">{report.title}</div>
                      <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{report.summary}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar size={15} className="text-gray-400" />
                        {new Date(report.meeting_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.pdf_url ? (
                        <a
                          href={report.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#014F43] hover:underline"
                        >
                          <FileText size={14} className="text-red-500" />
                          Consulter PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Aucun PDF lié</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.is_published ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                          <Globe size={12} />
                          Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                          <EyeOff size={12} />
                          Brouillon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/rapports/${report.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-lg transition-colors"
                        >
                          <Edit2 size={13} />
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
