import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { MultipartFile } from '@fastify/multipart'
import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.ts'
import { addWatermark } from '../utils/add-watermark.ts'
import { AllowedTypesImagesError } from './errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from './errors/maximum-15-photos-per-ad.ts'

interface OtherData {
  userType: 'owner' | 'mandatary' | 'broker' | 'legalEntity'
  nameOwner?: string
  rgOwner?: string
  cpfOwner?: string
  emailOwner?: string
  phoneOwner?: string
  authorizationDocumentOwner?: MultipartFile
  creciDocument?: MultipartFile
  name?: string
  company?: string
  cnpj?: string
  cpf?: string
  rg?: string
  phone?: string
  email?: string
  photo?: string
  creci?: string
}

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
  usersId,
  photos,
  partyRoom,
  userType,
  nameOwner,
  rgOwner,
  cpfOwner,
  emailOwner,
  phoneOwner,
  authorizationDocumentOwner,
  creciDocument,
  name,
  company,
  cnpj,
  cpf,
  rg,
  phone,
  email,
  creci,
}: Prisma.PropertyCreateManyInput & OtherData) {

  if (userType === 'mandatary' && !authorizationDocumentOwner) {
    throw new Error('Autorização do proprietário é obrigatória para mandatários')
  }

  if (userType === 'broker') {
    if (!authorizationDocumentOwner) {
      throw new Error('Autorização do proprietário é obrigatória para corretores')
    }
    if (!creciDocument) {
      throw new Error('Documento CRECI é obrigatório para corretores')
    }
    if (!creci) {
      throw new Error('Número do CRECI é obrigatório para corretores')
    }
  }

  const photosArray: MultipartFile[] = Array.isArray(photos) ? photos : [photos]

  const photosUrl: string[] = []

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

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

  let ownerDocumentFilename: string | undefined

  if (authorizationDocumentOwner) {
    const authorizationDocument: MultipartFile = authorizationDocumentOwner

    const file = await authorizationDocument.toBuffer()
    const filename = `${Date.now()}-${usersId}-${authorizationDocument.filename}`
    const originalPath = path.resolve(
      __dirname,
      '../../uploads/owners',
      filename
    )

    await fs.promises.writeFile(originalPath, file)

    ownerDocumentFilename = `owners/${filename}`
  }

  let creciDocumentFilename: string | undefined

  if (creciDocument) {
    if (!allowedTypes.includes(creciDocument.mimetype)) {
      throw new Error('Documento CRECI deve ser PDF, JPG ou PNG')
    }

    const file = await creciDocument.toBuffer()
    const filename = `${Date.now()}-${usersId}-${creciDocument.filename}`
    const originalPath = path.resolve(__dirname, '../../uploads/creci', filename)

    await fs.promises.writeFile(originalPath, file)

    creciDocumentFilename = `creci/${filename}`
  }

  let ownerId: string = ''

  if (nameOwner !== undefined) {
    const owner = await prisma.owner.create({
      data: {
        name: nameOwner ?? '',
        rg: rgOwner ?? '',
        cpf: cpfOwner ?? '',
        email: emailOwner ?? '',
        phone: phoneOwner ?? '',
        authorizationDocument: ownerDocumentFilename ?? '',
      }
    })

    ownerId = owner.id
  }




  await prisma.user.update({
    where: {
      id: usersId!
    },
    data: {
      name,
      cnpj,
      company,
      rg,
      cpf,
      email,
      phone,
      creci,
      photoCreci: creciDocumentFilename,
    }
  })

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
      ownerId: ownerId ? ownerId : undefined,
      usersId,
      photos: photosUrl ? photosUrl : undefined,
      iptu,
    },
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
