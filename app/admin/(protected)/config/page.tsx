import { createClient } from '@/lib/supabase/server'
import ConfigForm from '@/components/admin/ConfigForm'

export default async function ConfigPage() {
  const supabase = await createClient()
  
  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuration du site</h1>
        <p className="text-gray-600 mt-2">
          Gérez les paramètres généraux de votre site web
        </p>
      </div>

      <ConfigForm config={config} />
    </div>
  )
}
