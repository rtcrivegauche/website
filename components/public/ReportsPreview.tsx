'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, FileText, Download, ChevronRight, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Report {
  id: string
  title: string
  slug: string
  summary: string
  meeting_date: string
  pdf_url: string | null
}

export default function ReportsPreview() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    async function loadLatestReports() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('reports')
          .select('id, title, slug, summary, meeting_date, pdf_url')
          .eq('is_published', true)
          .order('meeting_date', { ascending: false })
          .limit(3)

        if (error) throw error
        if (data) {
          setReports(data)
        }
      } catch (e) {
        console.error('Erreur lors du chargement des derniers rapports:', e)
      }
    }
    loadLatestReports()
  }, [])

  if (reports.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[1320px] mx-auto">
        
        {/* En-tête */}
        <div className="flex justify-between items-end mb-12 px-6">
          <div className="space-y-3 max-w-xs md:max-w-2xl text-left">
            <div className="flex items-center gap-2.5 text-[#E11A60] font-bold text-xs uppercase tracking-widest">
              <FileText size={16} />
              <span>Transparence & Démocratie</span>
            </div>
            
            <h2 className="text-2xl md:text-5xl font-black text-[#014F43] tracking-tight leading-tight">
              Comptes-rendus & Rapports de Réunions
            </h2>
            
            <p className="text-gray-500 text-xs md:text-base leading-relaxed">
              Suivez de près la vie démocratique du club, les décisions collégiales et les rapports d&apos;activité officiels de nos réunions statutaires.
            </p>
          </div>

          <Link
            href="/rapports"
            className="text-[#014F43] hover:text-[#E11A60] transition-colors flex items-center gap-1.5 mb-1 md:mb-2 flex-shrink-0"
            aria-label="Voir tous les rapports"
          >
            <span className="text-xs font-bold uppercase tracking-wider hidden md:inline underline underline-offset-4">
              TOUS LES RAPPORTS
            </span>
            <span className="p-2.5 bg-gray-55 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 md:hidden transition-colors">
              <ChevronRight size={18} />
            </span>
          </Link>
        </div>

        {/* Liste / Grille des rapports (Grand écran) */}
        <div className="hidden md:grid grid-cols-3 gap-8 px-6">
          {reports.map((report) => {
            const dateStr = new Date(report.meeting_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })

            return (
              <div
                key={report.id}
                className="bg-gray-50/50 rounded-3xl border border-gray-150 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Date Badge */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E11A60] uppercase tracking-wider mb-4">
                    <Calendar size={13} />
                    <span>Réunion du {dateStr}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg font-bold text-[#014F43] group-hover:text-[#E11A60] transition-colors leading-snug line-clamp-2 mb-3">
                    {report.title}
                  </h3>

                  {/* Résumé */}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                    {report.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 pt-4 border-t border-gray-150/70">
                  <Link
                    href={`/rapports`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#014F43] text-white hover:bg-[#E11A60] text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
                  >
                    <Eye size={12} /> Lire le rapport
                  </Link>

                  {report.pdf_url && (
                    <a
                      href={report.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-250"
                      title="Télécharger le PDF"
                    >
                      <Download size={14} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Liste / Grille des rapports (Petit écran scrollable horizontalement) */}
        <div className="md:hidden reports-carousel px-6">
          {reports.map((report) => {
            const dateStr = new Date(report.meeting_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })

            return (
              <div
                key={report.id}
                className="bg-gray-50/50 rounded-3xl border border-gray-150 p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Date Badge */}
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#E11A60] uppercase tracking-wider mb-3">
                    <Calendar size={12} />
                    <span>Réunion du {dateStr}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-base font-bold text-[#014F43] leading-snug line-clamp-2 mb-2">
                    {report.title}
                  </h3>

                  {/* Résumé */}
                  <p className="text-xs text-gray-500 leading-normal line-clamp-3 mb-4">
                    {report.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-150/70">
                  <Link
                    href={`/rapports`}
                    className="flex-grow flex items-center justify-center gap-1 px-3 py-2 bg-[#014F43] text-white text-[9px] font-bold uppercase tracking-wider rounded-xl"
                  >
                    <Eye size={12} /> Lire le rapport
                  </Link>

                  {report.pdf_url && (
                    <a
                      href={report.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-gray-400 rounded-xl border border-gray-250"
                    >
                      <Download size={12} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
