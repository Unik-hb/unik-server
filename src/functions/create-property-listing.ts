import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { MultipartFile } from '@fastify/multipart'
import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.ts'
import { AllowedTypesImagesError } from './errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from './errors/maximum-15-photos-per-ad.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createPropertyListing({
  photos,
  ...data
}: Prisma.PropertyCreateManyInput) {
  const photosArray: MultipartFile[] = Array.isArray(photos) ? photos : [photos]

  const photosUrl: string[] = []

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  for await (const photo of photosArray) {
    if (!allowedTypes.includes(photo.mimetype)) {
      throw new AllowedTypesImagesError()
    }
  }

  if (photosArray.length >= 15) {
    throw new Maximum15PhotosPerAdError()
  }

  for await (const photo of photosArray) {
    const file = await photo.toBuffer()
    const filename = `${Date.now()}-${data.usersId}-${photo.filename}`

    await fs.promises.writeFile(
      path.resolve(__dirname, '../../uploads/properties', filename),
      file
    )

    photosUrl.push(`properties/${filename}`)
  }

  await prisma.property.create({
    data: {
      ...data,
      photos: photosUrl ? photosUrl : undefined,
    },
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
