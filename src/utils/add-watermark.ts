import path from 'node:path'
import sharp from 'sharp'

export async function addWatermark(inputPath: string, outputPath: string) {
  const watermarkPath = path.resolve('src/assets/watermark.png')

  const watermark = await sharp(watermarkPath).resize(64).png().toBuffer()

  await sharp(inputPath)
    .composite([
      {
        input: watermark,
        gravity: 'southeast',
        blend: 'overlay',
      },
    ])
    .toFile(outputPath)

  return outputPath
}
