import { createClient } from '@/lib/supabase/server'
import ReportForm from '@/components/admin/ReportForm'

interface EditReportPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditReportPageProps) {
  const { id } = await params
  return {
    title: id === 'nouveau' ? 'Nouveau Rapport - Administration' : 'Modifier le Rapport - Administration'
  }
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  let report = null
  
  if (id !== 'nouveau') {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single()
    
    report = data
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
        {report ? 'Modifier le rapport' : 'Nouveau rapport de réunion'}
      </h1>
      <ReportForm report={report} />
    </div>
  )
}
