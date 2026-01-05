import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { MultipartFile } from '@fastify/multipart'
import type { Category, TypeOfProperty } from '@prisma/client'
import { prisma } from '../database/prisma.ts'
import { addWatermark } from '../utils/add-watermark.ts'
import { AllowedTypesImagesError } from './errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from './errors/maximum-15-photos-per-ad.ts'
import { PropertyNotFoundError } from './errors/property-not-found.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface PropertyReviewRequest {
  propertyId: string
  title?: string
  description?: string
  category?: Category
  typeOfProperty?: TypeOfProperty
  iptu?: number
  price?: number
  condoFee?: number
  builtArea?: string
  bedrooms?: number
  suites?: number
  bathrooms?: number
  parkingSpots?: number
  updatedRegistry?: string
  address?: string
  addressNumber?: string
  uf?: string
  neighborhood?: string
  city?: string
  zipCode?: string
  stairFlights?: number
  elevator?: boolean
  airConditioning?: boolean
  pool?: boolean
  sevantsRoom?: boolean
  terrace?: boolean
  closet?: boolean
  residential?: boolean
  gourmetArea?: boolean
  gym?: boolean
  coworking?: boolean
  playroom?: boolean
  petArea?: boolean
  partyRoom?: boolean
  photos?: MultipartFile | MultipartFile[]
  keepExistingPhotos?: boolean
}

export async function propertyReview({
  propertyId,
  title,
  description,
  category,
  typeOfProperty,
  iptu,
  price,
  condoFee,
  builtArea,
  bedrooms,
  suites,
  bathrooms,
  parkingSpots,
  updatedRegistry,
  address,
  addressNumber,
  uf,
  neighborhood,
  city,
  zipCode,
  stairFlights,
  elevator,
  airConditioning,
  pool,
  sevantsRoom,
  terrace,
  closet,
  residential,
  gourmetArea,
  gym,
  coworking,
  playroom,
  petArea,
  partyRoom,
  photos,
  keepExistingPhotos = false,
}: PropertyReviewRequest) {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
      status: 'REVISION',
    },
  })

  if (!property) {
    throw new PropertyNotFoundError()
  }

  let photosUrl: string[] = []
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  // Se keepExistingPhotos for true, mantém as fotos existentes
  if (keepExistingPhotos && property.photos) {
    photosUrl = property.photos as string[]
  }

  // Se novas fotos forem enviadas, processa o upload
  if (photos) {
    const photosArray: MultipartFile[] = Array.isArray(photos) ? photos : [photos]

    // Validação de tipos permitidos
    for await (const photo of photosArray) {
      if (!allowedTypes.includes(photo.mimetype)) {
        throw new AllowedTypesImagesError()
      }
    }

    // Validação de quantidade máxima (considerando fotos existentes se manter)
    const totalPhotos = photosUrl.length + photosArray.length
    if (totalPhotos > 15) {
      throw new Maximum15PhotosPerAdError()
    }

    // Processa cada nova foto
    for await (const photo of photosArray) {
      const file = await photo.toBuffer()
      const filename = `${Date.now()}-${property.usersId}-${photo.filename}`
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

    // Se não mantiver fotos antigas, remove os arquivos antigos
    if (!keepExistingPhotos && property.photos) {
      const oldPhotos = property.photos as string[]
      for (const oldPhoto of oldPhotos) {
        const oldPhotoPath = path.resolve(__dirname, '../../uploads', oldPhoto)
        try {
          await fs.promises.unlink(oldPhotoPath)
        } catch (error) {
          // Ignora erro se arquivo não existir
          console.warn(`Não foi possível remover foto antiga: ${oldPhoto}`)
        }
      }
    }
  }

  await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      title,
      description,
      category,
      typeOfProperty,
      iptu,
      price,
      condoFee,
      builtArea,
      bedrooms,
      suites,
      bathrooms,
      parkingSpots,
      updatedRegistry,
      address,
      addressNumber,
      uf,
      neighborhood,
      city,
      zipCode,
      stairFlights,
      elevator,
      airConditioning,
      pool,
      sevantsRoom,
      terrace,
      closet,
      residential,
      gourmetArea,
      gym,
      coworking,
      playroom,
      petArea,
      partyRoom,
      ...(photosUrl.length > 0 && { photos: photosUrl }),
      status: 'PENDING',
      motiveRevision: null,
    },
  })

  return {
    message: 'Propriedade atualizada e enviada para análise com sucesso',
  }
}
