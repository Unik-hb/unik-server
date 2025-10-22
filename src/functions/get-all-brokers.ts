import { prisma } from '../database/prisma.ts'

export async function getAllBrokers() {
  const brokers = await prisma.user.findMany({
    where: {
      role: 'BROKER',
    },

    select: {
      id: true,
      name: true,
      description: true,
      email: true,
      photo: true,
      phone: true,
      properties: {
        select: {
          id: true,
          photos: true,
          category: true,
          title: true,
          city: true,
          neighborhood: true,
          builtArea: true,
          bedrooms: true,
          bathroon: true,
          price: true,
          User: {
            select: {
              photo: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    brokers,
  }
}
