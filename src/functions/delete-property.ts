import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from '../database/prisma.ts'
import { PropertyNotFoundError } from './errors/property-not-found.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface DeletePropertyRequest {
  propertyId: string
}

export async function deleteProperty({ propertyId }: DeletePropertyRequest) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { photos: true },
  })

  if (!property) {
    throw new PropertyNotFoundError()
  }

  const photosArray = property.photos as string[]

  if (photosArray && Array.isArray(photosArray) && photosArray.length > 0) {
    for (const photoPath of photosArray) {
      try {
        const filename = photoPath.split('/').pop()

        if (filename) {
          const filePath = path.resolve(
            __dirname,
            '../../uploads/properties',
            filename
          )

          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath)
          }
        }
      } catch (error) {
        console.error('Erro ao deletar arquivo físico:', error)
      }
    }
  }

  await prisma.property.delete({
    where: { id: propertyId },
  })

  return {
    message: 'Propriedade deletada com sucesso',
    deletedPhotos: photosArray?.length || 0,
  }
}