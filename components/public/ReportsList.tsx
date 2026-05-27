'use client'

import { useState } from 'react'
import { Calendar, FileText, Search, Download, Eye, X } from 'lucide-react'
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer'

interface Report {
  id: string
  title: string
  slug: string
  summary: string
  content: string | null
  pdf_url: string | null
  meeting_date: string
  created_at: string
}

interface ReportsListProps {
  initialReports: Report[]
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function ReportsList({ initialReports }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  // Calculer dynamiquement les années et mois disponibles dans les rapports
  const years = Array.from(new Set(initialReports.map(r => new Date(r.meeting_date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))
  const months = Array.from(new Set(initialReports.map(r => new Date(r.meeting_date).getMonth()))).sort((a, b) => a - b)

  // Filtrage intelligent en temps réel côté client
  const filteredReports = reports.filter(report => {
    const meetingDate = new Date(report.meeting_date)
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMonth = selectedMonth === '' || meetingDate.getMonth().toString() === selectedMonth
    const matchesYear = selectedYear === '' || meetingDate.getFullYear().toString() === selectedYear

    return matchesSearch && matchesMonth && matchesYear
  })

  const openReport = (report: Report) => {
    setActiveReport(report)
    document.body.style.overflow = 'hidden'
  }

  const closeReport = () => {
    setActiveReport(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="space-y-8">
      {/* Barre de Filtres & Recherche */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par mot clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm"
              aria-label="Rechercher par mot clé"
            />
          </div>

          {/* Filtre Année */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm text-gray-700 bg-white"
            aria-label="Filtrer par année"
          >
            <option value="">Toutes les années</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Filtre Mois */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#014F43] focus:border-transparent text-sm text-gray-700 bg-white"
            aria-label="Filtrer par mois"
          >
            <option value="">Tous les mois</option>
            {months.map(monthIdx => (
              <option key={monthIdx} value={monthIdx.toString()}>{MONTHS_FR[monthIdx]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grille des rapports */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-sm max-w-xl mx-auto">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Aucun rapport trouvé</h3>
          <p className="text-sm text-gray-500">Essayez de modifier vos filtres ou le terme de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const dateStr = new Date(report.meeting_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-gray-150 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  {/* Badge Date */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11A60] uppercase tracking-wider mb-3">
                    <Calendar size={14} />
                    <span>Réunion du {dateStr}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold text-[#014F43] leading-tight mb-2 line-clamp-2">
                    {report.title}
                  </h3>

                  {/* Résumé */}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {report.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openReport(report)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#014F43] hover:bg-[#E11A60] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
                  >
                    <Eye size={14} /> Lire le rapport
                  </button>
                  
                  {report.pdf_url && (
                    <a
                      href={report.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-xl transition-all"
                      title="Télécharger le PDF officiel"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Plein Écran de Lecture Riche */}
      {activeReport && (
        <div className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E11A60] text-white px-3 py-1 rounded-full">
                  Rapport Officiel
                </span>
                <h4 className="text-sm text-gray-500 font-semibold mt-1">
                  Réunion statutaire du {new Date(activeReport.meeting_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h4>
              </div>
              <button
                onClick={closeReport}
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors"
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenu Modal */}
            <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6">
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#014F43] tracking-tight leading-tight">
                {activeReport.title}
              </h2>

              {/* Résumé */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Résumé analytique</h5>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {activeReport.summary}
                </p>
              </div>

              {/* Contenu Riche HTML */}
              {activeReport.content && (
                <div className="prose prose-lg max-w-none border-t border-gray-100 pt-6">
                  <SafeHtmlRenderer html={activeReport.content} />
                </div>
              )}
            </div>

            {/* Footer Modal avec téléchargement PDF */}
            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={closeReport}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Fermer
              </button>
              
              {activeReport.pdf_url && (
                <a
                  href={activeReport.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#014F43] hover:bg-[#E11A60] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow"
                >
                  <Download size={14} /> Télécharger le PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
