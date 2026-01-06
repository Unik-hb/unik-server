import { prisma } from "../database/prisma.ts";

interface GetAllPropertiesRequests {
  pageIndex: number
}

export async function listOfPropertiesSoldRentedRejected({ pageIndex }: GetAllPropertiesRequests) {
  const properties = await prisma.property.findMany({

    where: {
      statusPost: 'INACTIVE'
    },
    skip: pageIndex * 10,
    take: 10,

    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      User: {
        select: {
          name: true,
        }
      }
    }
  })

  const totalProperties = await prisma.property.count({
    where: {
      statusPost: 'INACTIVE'
    }
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