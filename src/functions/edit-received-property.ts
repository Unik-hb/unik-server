import { prisma } from "../database/prisma.ts"

interface EditReceivedPropertyRequest {
  propertyId: string
  title: string
  description: string
}

export async function editReceivedPropety({ propertyId, title, description }: EditReceivedPropertyRequest) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      title,
      description
    }
  })

  return {
    message: 'Editado com sucesso'
  }
}