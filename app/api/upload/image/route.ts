import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { validateImage, processImage } from '@/lib/image-processor'
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
    const entityType = formData.get('entityType') as string || 'uploads'
    const entityId = formData.get('entityId') as string | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été fourni." }, { status: 400 })
    }

    // 3. Valider le fichier
    try {
      validateImage(file.type, file.size)
    } catch (validationErr: any) {
      return NextResponse.json({ error: validationErr.message }, { status: 400 })
    }

    // Convertir le fichier en Buffer pour Sharp
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 4. Traiter et optimiser l'image avec Sharp
    const { main, thumbnail } = await processImage(buffer)

    // 5. Préparer les chemins d'accès R2
    const uuid = uuidv4()
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    // Structure : dossiers logiques par entité
    const mainKey = `${entityType}/${entityId ? `${entityId}/` : ''}main-${uuid}.webp`
    const thumbKey = `${entityType}/${entityId ? `${entityId}/` : ''}thumb-${uuid}.webp`

    const bucketName = R2_BUCKET_NAME
    const publicBaseUrl = R2_PUBLIC_URL.replace(/\/$/, '')

    if (!bucketName) {
      return NextResponse.json({ error: 'Configuration R2 incomplète : bucket name manquant.' }, { status: 500 })
    }
    if (!publicBaseUrl) {
      return NextResponse.json({ error: 'Configuration R2 incomplète : public URL manquante.' }, { status: 500 })
    }

    // 6. Téléverser vers Cloudflare R2
    await Promise.all([
      r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: mainKey,
        Body: main.buffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000',
      })),
      r2Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: thumbKey,
        Body: thumbnail.buffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000',
      }))
    ])

    const mainUrl = `${publicBaseUrl}/${mainKey}`
    const thumbUrl = `${publicBaseUrl}/${thumbKey}`

    // 7. Enregistrer les métadonnées dans Supabase
    const { data: mediaFile, error: dbError } = await supabase
      .from('media_files')
      .insert({
        user_id: user.id,
        entity_type: entityType,
        entity_id: entityId || null,
        original_name: sanitizedOriginalName,
        file_key: mainKey,
        public_url: mainUrl,
        thumbnail_key: thumbKey,
        thumbnail_url: thumbUrl,
        mime_type: 'image/webp',
        final_format: 'webp',
        size_bytes: main.size,
        width: main.width,
        height: main.height,
        bucket: bucketName,
        provider: 'cloudflare_r2'
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Erreur lors de l'enregistrement en BDD: ${dbError.message}`)
    }

    return NextResponse.json({
      message: 'Fichier uploadé et optimisé avec succès.',
      media_id: mediaFile.id,
      image_url: mainUrl,
      thumbnail_url: thumbUrl
    })

  } catch (error: any) {
    console.error('Erreur API Upload:', error)
    return NextResponse.json({ error: error.message || 'Une erreur interne est survenue.' }, { status: 500 })
  }
}
