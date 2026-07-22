const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const sourceImage = path.join(__dirname, '../public/icons/favicon rtc-rgc.png');
  const iconsDir = path.join(__dirname, '../public/icons');
  const publicDir = path.join(__dirname, '../public');
  const appDir = path.join(__dirname, '../app');

  if (!fs.existsSync(sourceImage)) {
    console.error('Source image not found:', sourceImage);
    return;
  }

  console.log('Génération des icônes PWA et favicons à partir de:', sourceImage);

  // 1. Icon 192x192 pour PWA Android
  await sharp(sourceImage)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));

  // 2. Icon 512x512 pour PWA Splash Screen & Android
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  // 3. Apple Touch Icon 180x180 (avec fond blanc propre pour iOS)
  await sharp(sourceImage)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(iconsDir, 'apple-icon.png'));

  await sharp(sourceImage)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // 4. Icon 512x512 pour app/icon.png
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  // 5. Favicon 32x32 et 16x16
  await sharp(sourceImage)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(sourceImage)
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  console.log('Toutes les icônes PWA et favicons ont été générées avec succès !');
}

generateIcons().catch(console.error);
