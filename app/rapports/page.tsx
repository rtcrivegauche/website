import { createClient } from '@/lib/supabase/server'
import { FileText, Award } from 'lucide-react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ReportsList from '@/components/public/ReportsList'

export const metadata = {
  title: 'Rapports & Comptes Rendus',
  description: 'Consultez en toute transparence les comptes rendus de nos réunions statutaires et de nos assemblées générales.',
}

export default async function RapportsPage() {
  const supabase = await createClient()

  // Récupérer tous les rapports publiés
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('is_published', true)
    .order('meeting_date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />
      <main className="flex-grow mt-24">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#014F43] to-[#00362d] text-white py-16 md:py-24">
          <div className="max-w-[1320px] mx-auto px-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <FileText size={36} className="text-[#E11A60]" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Rapports & Comptes Rendus</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Accédez librement aux comptes rendus officiels de nos réunions et assemblées pour suivre notre gouvernance transparente.
            </p>
          </div>
        </section>

        {/* Liste Interactive des rapports */}
        <section className="max-w-[1320px] mx-auto px-6 py-16">
          {!reports || reports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-150 p-16 text-center shadow-sm max-w-2xl mx-auto">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun rapport disponible</h3>
              <p className="text-gray-500">Les comptes rendus de nos réunions statutaires seront très prochainement publiés en toute transparence !</p>
            </div>
          ) : (
            <ReportsList initialReports={reports} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
