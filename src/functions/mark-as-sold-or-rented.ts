import { prisma } from "../database/prisma.ts"

interface MarkAsSoldOrRentedParams {
  propertyId: string
}

export async function markAsSoldOrRented({
  propertyId }: MarkAsSoldOrRentedParams) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      statusPost: 'INACTIVE'
    }
  })

  return {
    message: 'Imóvel marcado como vendido/alugado com sucesso.'
  }
}