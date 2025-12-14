import { prisma } from '../database/prisma.ts'
import { PropertyNotFoundError } from './errors/property-not-found.ts'
import { PhotoNotFoundError } from './errors/photo-not-found.ts'

interface SetFeaturedPhotoInput {
  propertyId: string
  photoPath: string
}

export async function setFeaturedPhoto({
  propertyId,
  photoPath,
}: SetFeaturedPhotoInput) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { photos: true },
  })

  if (!property) {
    throw new PropertyNotFoundError()
  }

  // Converter o campo photos para array de strings
  const photosArray = property.photos as unknown as string[]

  if (!photosArray || !Array.isArray(photosArray)) {
    throw new Error('Propriedade não possui fotos')
  }

  if (!photosArray.includes(photoPath)) {
    throw new PhotoNotFoundError()
  }

  // Remover a foto da posição atual
  const filteredPhotos = photosArray.filter((photo) => photo !== photoPath)

  const reorderedPhotos = [photoPath, ...filteredPhotos]

  await prisma.property.update({
    where: { id: propertyId },
    data: { photos: reorderedPhotos },
  })

  return {
    message: 'Foto definida como destaque com sucesso',
    featuredPhoto: photoPath,
    photos: reorderedPhotos,
  }
}
