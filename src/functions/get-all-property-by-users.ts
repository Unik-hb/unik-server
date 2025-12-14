import { prisma } from "../database/prisma.ts";

interface GetAllPropetiesApprovedRequets {
  pageIndex: number
  usersId?: string
}

export async function getAllPropertyByUsers({ pageIndex, usersId }: GetAllPropetiesApprovedRequets) {
  const properties = await prisma.property.findMany({
    where: {
      usersId
    },

    skip: pageIndex * 10,
    take: 10,

    include: {
      User: {
        select: {
          name: true,
          phone: true
        }
      },
      owner: {
        select: {
          name: true,
          authorizationDocument: true
        }
      }
    },


    orderBy: {
      createdAt: 'desc'
    }
  })

  const totalProperties = await prisma.property.count({
    where: {
      usersId
    },
  })

  const totalPages = Math.ceil(totalProperties / 10) ?? 1

  return {
    properties,
    metas: {
      totalPages,
      totalProperties,
    }
  }
}