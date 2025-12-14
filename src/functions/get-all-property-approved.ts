import { prisma } from "../database/prisma.ts";

interface GetAllPropetiesApprovedRequets {
  pageIndex: number
}

export async function getAllPropertyApproved({ pageIndex }: GetAllPropetiesApprovedRequets) {
  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
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
      status: "APPROVED",
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