import { prisma } from '../database/prisma.ts'

interface GetPropertiesByBrokerQuery {
  usersId: string
}

export async function getDetailsBroker({
  usersId,
}: GetPropertiesByBrokerQuery) {
  const broker = await prisma.user.findFirst({
    where: {
      id: usersId,
      role: 'BROKER',
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      description: true,
      photo: true,
      properties: {
        select: {
          id: true,
          title: true,
          category: true,
          photos: true,
          city: true,
          neighborhood: true,
          builtArea: true,
          bathroon: true,
          bedrooms: true,
          price: true,
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    broker,
  }
}
