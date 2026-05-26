import sharp from 'sharp'

export interface ProcessedImage {
  buffer: Buffer
  width: number
  height: number
  size: number
}

export interface ProcessedMedia {
  main: ProcessedImage
  thumbnail: ProcessedImage
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 Mo

/**
 * Valide si le type MIME et la taille du fichier sont acceptés.
 */
export function validateImage(mimeType: string, fileSize: number) {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error('Format non supporté. Seuls les formats JPEG, PNG et WebP sont acceptés.')
  }
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error('Fichier trop volumineux. La taille maximale autorisée est de 10 Mo.')
  }
}

/**
 * Compresse et redimensionne l'image entrante avec Sharp :
 * - Image principale : max 1200px de large, format WebP, qualité 80
 * - Miniature : max 300px de large, format WebP, qualité 80
 */
export async function processImage(buffer: Buffer): Promise<ProcessedMedia> {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  // 1. Image principale (WebP, max-width 1200px, qualité 80)
  let mainPipeline = image.clone().webp({ quality: 80 })
  if (metadata.width && metadata.width > 1200) {
    mainPipeline = mainPipeline.resize(1200, null, { withoutEnlargement: true })
  }
  const mainBuffer = await mainPipeline.toBuffer()
  const mainMeta = await sharp(mainBuffer).metadata()

  // 2. Miniature (WebP, max-width 300px, qualité 80)
  let thumbPipeline = image.clone().webp({ quality: 80 })
  if (metadata.width && metadata.width > 300) {
    thumbPipeline = thumbPipeline.resize(300, null, { withoutEnlargement: true })
  } else {
    thumbPipeline = thumbPipeline.resize(300)
  }
  const thumbBuffer = await thumbPipeline.toBuffer()
  const thumbMeta = await sharp(thumbBuffer).metadata()

  return {
    main: {
      buffer: mainBuffer,
      width: mainMeta.width || 0,
      height: mainMeta.height || 0,
      size: mainBuffer.length
    },
    thumbnail: {
      buffer: thumbBuffer,
      width: thumbMeta.width || 0,
      height: thumbMeta.height || 0,
      size: thumbBuffer.length
    }
  }
}
