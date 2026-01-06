import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '../database/prisma.ts'
import { PhotoNotFoundError } from './errors/photo-not-found.ts'
import { PropertyNotFoundError } from './errors/property-not-found.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface DeletePropertyPhotoInput {
  propertyId: string
  photoPath: string
}

export async function deletePropertyPhoto({
  propertyId,
  photoPath,
}: DeletePropertyPhotoInput) {
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

  // Remover a foto do array
  const updatedPhotos = photosArray.filter(photo => photo !== photoPath)

  // Atualizar o banco de dados
  await prisma.property.update({
    where: { id: propertyId },
    data: { photos: updatedPhotos },
  })

  // Deletar o arquivo físico do servidor
  try {
    const filename = photoPath.split('/').pop() // Pega apenas o nome do arquivo

    if (filename) {
      const filePath = path.resolve(
        __dirname,
        '../../uploads/properties',
        filename
      )

      // Verificar se o arquivo existe antes de deletar
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
      }
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo físico:', error)
  }

  return {
    message: 'Foto deletada com sucesso',
    remainingPhotos: updatedPhotos,
  }
}
