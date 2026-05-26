import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { r2Client } from '@/lib/r2'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export async function POST(req: Request) {
  try {
    // 1. Authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 })
    }

    const { mediaId } = await req.json()
    if (!mediaId) {
      return NextResponse.json({ error: 'ID média manquant.' }, { status: 400 })
    }

    // 2. Récupérer les informations du média depuis Supabase
    const { data: media, error: selectError } = await supabase
      .from('media_files')
      .select('file_key, thumbnail_key, bucket')
      .eq('id', mediaId)
      .single()

    if (selectError || !media) {
      return NextResponse.json({ error: 'Média introuvable ou déjà supprimé.' }, { status: 404 })
    }

    // 3. Supprimer de Cloudflare R2
    const deletePromises = [
      r2Client.send(new DeleteObjectCommand({
        Bucket: media.bucket,
        Key: media.file_key
      }))
    ]

    if (media.thumbnail_key) {
      deletePromises.push(
        r2Client.send(new DeleteObjectCommand({
          Bucket: media.bucket,
          Key: media.thumbnail_key
        }))
      )
    }

    // Attendre la suppression des fichiers physiques sur R2
    await Promise.all(deletePromises)

    // 4. Supprimer de la base de données
    const { error: deleteError } = await supabase
      .from('media_files')
      .delete()
      .eq('id', mediaId)

    if (deleteError) {
      throw new Error(`Échec de la suppression en base de données : ${deleteError.message}`)
    }

    return NextResponse.json({ success: true, message: 'Fichier et miniature supprimés de R2 et de la base de données.' })

  } catch (error: any) {
    console.error('Erreur API Suppression:', error)
    return NextResponse.json({ error: error.message || 'Une erreur interne est survenue.' }, { status: 500 })
  }
}
