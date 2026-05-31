import { S3Client } from '@aws-sdk/client-s3'

// Nettoyage robuste des variables d'environnement contre les copier-coller contenant des espaces ou des préfixes
const cleanAccountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '')
  .trim()
  .replace(/^https?:\/\//i, '') // supprime un éventuel http:// ou https://
  .replace(/\/+$/, ''); // supprime les slashes de fin

const cleanAccessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim()
const cleanSecretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim()

if (!cleanAccountId) {
  console.warn('Warning: CLOUDFLARE_R2_ACCOUNT_ID is missing or empty')
}

export const r2Client = new S3Client({
  endpoint: `https://${cleanAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: cleanAccessKeyId,
    secretAccessKey: cleanSecretAccessKey,
  },
  region: 'auto',
  forcePathStyle: true, // REQUIS pour Cloudflare R2 afin d'éviter les erreurs SSL de double sous-domaine !
})

export const R2_BUCKET_NAME = (process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim()
export const R2_PUBLIC_URL = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim()
