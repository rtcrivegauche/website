import { createClient } from '@/lib/supabase/server'
import FileManager, { FileItem } from '@/components/admin/file-manager/FileManager'

export default async function MediaPage() {
  const supabase = await createClient()
  
  const { data: media } = await supabase
    .from('media_files')
    .select('*')
    .order('created_at', { ascending: false })

  const initialFiles: FileItem[] = (media || []).map(m => ({
    id: m.id,
    title: m.original_name || 'Sans titre',
    url: m.public_url || m.url,
    media_type: m.mime_type || 'image/jpeg',
    file_size: m.size_bytes || m.file_size,
    created_at: m.created_at
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionnaire de fichiers</h1>
        <p className="text-gray-600 mt-1">
          Explorez, organisez et prévisualisez vos images et documents dans vos dossiers
        </p>
      </div>

      <FileManager initialFiles={initialFiles} />
    </div>
  )
}
