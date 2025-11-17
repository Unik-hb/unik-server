import { prisma } from "../database/prisma.ts";

interface GetAllPropetiesRequets {
  pageIndex: number
}

export async function getAllProperty({ pageIndex }: GetAllPropetiesRequets) {
  const properties = await prisma.property.findMany({

    skip: pageIndex * 10,
    take: 10,


    orderBy: {
      createdAt: 'desc'
    }
  })

  const totalProperties = await prisma.property.count()

  const totalPages = Math.ceil(totalProperties / 10) ?? 1

  return {
    properties,
    metas: {
      totalPages,
      totalProperties,
    }
  }
}