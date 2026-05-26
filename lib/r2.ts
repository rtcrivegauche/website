import { S3Client } from '@aws-sdk/client-s3'

if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
  console.warn('Warning: CLOUDFLARE_R2_ACCOUNT_ID is missing from environment variables')
}

export const r2Client = new S3Client({
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID || ''}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
  region: 'auto',
})
export const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || ''
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || ''
