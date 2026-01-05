import { prisma } from "../database/prisma.ts"

interface MarkAsSoldOrRentedParams {
  propertyId: string
}

export async function markAsSoldOrRented({
  propertyId }: MarkAsSoldOrRentedParams) {

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId
    },

    select: {
      category: true,
      price: true
    }
  })

  if (property?.category === 'SALE') {
    await prisma.sales.create({
      data: {
        amount: property.price,
        date: new Date()
      }
    })
  } else if (property?.category === 'RENT') {
    await prisma.rent.create({
      data: {
        amount: property.price,
        date: new Date()
      }
    })
  }

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