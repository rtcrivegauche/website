import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    // 1. Vérifier l'authentification de l'utilisateur
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé. Veuillez vous connecter.' }, { status: 401 })
    }

    // 2. Récupérer les infos de fichier
    const { filename, contentType, entityType = 'uploads' } = await req.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename et contentType sont requis' }, { status: 400 })
    }

    const bucketName = R2_BUCKET_NAME
    const publicBaseUrl = R2_PUBLIC_URL.replace(/\/$/, '')

    if (!bucketName || !publicBaseUrl) {
      return NextResponse.json({ error: 'Configuration R2 incomplète.' }, { status: 500 })
    }

    // 3. Générer la clé de fichier unique dans R2
    const uuid = uuidv4()
    const sanitizedOriginalName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileKey = `${entityType}/${uuid}-${sanitizedOriginalName}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: contentType,
    })

    // Génère l'URL d'upload présignée (valable 15 minutes)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 })

    // L'URL publique d'accès final
    const publicUrl = `${publicBaseUrl}/${fileKey}`

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      fileKey,
      originalName: sanitizedOriginalName
    })

  } catch (error: any) {
    console.error('Erreur API Presign:', error)
    return NextResponse.json({ error: error.message || 'Une erreur interne est survenue.' }, { status: 500 })
  }
}
