import { prisma } from '../database/prisma'

export async function searchFeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: {
      price: {
        gt: 100000, // maior que 100.000
      },
    },

    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    properties,
  }
}
