import { S3Client } from '@aws-sdk/client-s3'

// Nettoyage robuste des variables d'environnement contre les copier-coller contenant des espaces, des préfixes ou des URLs complètes
const rawAccountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim()
const entrypoint = (process.env.CLOUDFLARE_R2_ENTRYPOINT || '').trim()

let endpointUrl = ''
if (entrypoint) {
  endpointUrl = entrypoint.startsWith('http') ? entrypoint : `https://${entrypoint}`
} else if (rawAccountId) {
  if (rawAccountId.includes('r2.cloudflarestorage.com')) {
    // Si l'utilisateur a collé l'endpoint complet à la place de l'ID de compte
    endpointUrl = rawAccountId.startsWith('http') ? rawAccountId : `https://${rawAccountId}`
  } else {
    endpointUrl = `https://${rawAccountId}.r2.cloudflarestorage.com`
  }
}

const cleanAccessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim()
const cleanSecretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim()

if (!endpointUrl) {
  console.warn('Warning: Cloudflare R2 endpoint configuration is missing')
}

export const r2Client = new S3Client({
  endpoint: endpointUrl,
  credentials: {
    accessKeyId: cleanAccessKeyId,
    secretAccessKey: cleanSecretAccessKey,
  },
  region: 'auto',
  forcePathStyle: true, // REQUIS pour Cloudflare R2 afin d'éviter les erreurs SSL de double sous-domaine !
})

export const R2_BUCKET_NAME = (process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim()
export const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim()
