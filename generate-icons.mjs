import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

async function generateIcons() {
  const svgBuffer = fs.readFileSync('public/icons/icon.svg')

  const sizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 512, name: 'icon-512-maskable.png', padding: 64 }
  ]

  for (const { size, name, padding } of sizes) {
    const paddedSize = padding ? size + padding * 2 : size

    // Create a square canvas with padding for maskable icon
    const canvas = Buffer.alloc(paddedSize * paddedSize * 4, 0)

    await sharp({
      create: {
        width: paddedSize,
        height: paddedSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{
      input: await sharp(svgBuffer).resize(size, size).toBuffer(),
      top: padding || 0,
      left: padding || 0
    }])
    .png()
    .toFile(`public/icons/${name}`)

    console.log(`Generated ${name}`)
  }

  console.log('All icons generated!')
}

generateIcons().catch(console.error)