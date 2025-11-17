import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { MultipartFile } from '@fastify/multipart'
import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.ts'
import { addWatermark } from '../utils/add-watermark.ts'
import { AllowedTypesImagesError } from './errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from './errors/maximum-15-photos-per-ad.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createProperties({
  address,
  iptu,
  addressNumber,
  airConditioning,
  bathrooms,
  bedrooms,
  builtArea,
  category,
  city,
  closet,
  condoFee,
  coworking,
  description,
  elevator,
  gourmetArea,
  gym,
  neighborhood,
  parkingSpots,
  petArea,
  playroom,
  pool,
  price,
  residential,
  sevantsRoom,
  stairFlights,
  suites,
  terrace,
  title,
  typeOfProperty,
  uf,
  updatedRegistry,
  zipCode,
  ownerId,
  usersId,
  photos,
  partyRoom
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
    const filename = `${Date.now()}-${usersId}-${photo.filename}`
    const originalPath = path.resolve(
      __dirname,
      '../../uploads/properties',
      filename
    )

    await fs.promises.writeFile(originalPath, file)

    const watermarkedName = `wm-${filename}`
    const watermarkedPath = path.resolve(
      __dirname,
      '../../uploads/properties',
      watermarkedName
    )

    await addWatermark(originalPath, watermarkedPath)

    photosUrl.push(`properties/${watermarkedName}`)

    await fs.promises.unlink(originalPath)
  }

  await prisma.property.create({
    data: {
      partyRoom,
      address,
      addressNumber,
      airConditioning,
      bathrooms,
      bedrooms,
      builtArea,
      category,
      city,
      closet,
      condoFee,
      coworking,
      description,
      elevator,
      gourmetArea,
      gym,
      neighborhood,
      parkingSpots,
      petArea,
      playroom,
      pool,
      price,
      residential,
      sevantsRoom,
      stairFlights,
      suites,
      terrace,
      title,
      typeOfProperty,
      uf,
      updatedRegistry,
      zipCode,
      ownerId,
      usersId,
      photos: photosUrl ? photosUrl : undefined,
      iptu,
    },
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
