import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    // 1. Vérifier l'authentification de l'utilisateur
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 })
    }

    // 2. Extraire les données du formulaire
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const entityType = formData.get('entityType') as string || 'reports'
    const entityId = formData.get('entityId') as string | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été fourni." }, { status: 400 })
    }

    // 3. Valider le type de fichier (uniquement PDF)
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 })
    }

    // Valider la taille (20 Mo max)
    const MAX_SIZE = 20 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Le fichier est trop volumineux (20 Mo maximum)." }, { status: 400 })
    }

    // Convertir en Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 4. Préparer les chemins d'accès R2
    const uuid = uuidv4()
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    // Structure : dossiers logiques par entité
    const fileKey = `${entityType}/${entityId ? `${entityId}/` : ''}doc-${uuid}.pdf`

    const bucketName = R2_BUCKET_NAME
    const publicBaseUrl = R2_PUBLIC_URL.replace(/\/$/, '')

    if (!bucketName || !publicBaseUrl) {
      return NextResponse.json({ error: 'Configuration R2 incomplète.' }, { status: 500 })
    }

    // 5. Téléverser vers Cloudflare R2
    await r2Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: 'application/pdf',
      CacheControl: 'public, max-age=31536000',
    }))

    const fileUrl = `${publicBaseUrl}/${fileKey}`

    // 6. Enregistrer les métadonnées dans Supabase si la table media_files existe
    const { data: mediaFile, error: dbError } = await supabase
      .from('media_files')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId || null,
        original_name: sanitizedOriginalName,
        file_key: fileKey,
        public_url: fileUrl,
        mime_type: 'application/pdf',
        final_format: 'pdf',
        size_bytes: file.size,
        bucket: bucketName,
        provider: 'cloudflare_r2'
      })
      .select()
      .single()

    // Si la table n'existe pas ou s'il y a un souci RLS mais que le fichier R2 est là, on continue
    if (dbError) {
      console.warn("DB media_files registration failed, but file is uploaded to R2:", dbError)
    }

    return NextResponse.json({
      message: 'Fichier PDF téléversé avec succès.',
      pdf_url: fileUrl,
      media_id: mediaFile?.id || null
    })

  } catch (error: any) {
    console.error('Erreur API Upload PDF:', error)
    return NextResponse.json({ error: error.message || 'Une erreur interne est survenue.' }, { status: 500 })
  }
}
