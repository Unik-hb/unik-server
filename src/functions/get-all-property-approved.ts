import { prisma } from "../database/prisma.ts";

interface GetAllPropetiesApprovedRequets {
  pageIndex: number,
  category: 'SALE' | 'RENT' | null
  neighborhood: string | null
  minPrice: number | null
  maxPrice: number | null
  typeOfProperty: 'HOUSE' | 'APARTMENT' | 'STUDIO' | 'LOFT' | 'LOT' | 'LAND' | 'FARM' | 'SHOPS' | 'GARAGE' | 'BUILDING' | 'SHED' | 'NO_RESIDENCIAL' | null
  bathrooms: number | null // banheiro
  bedrooms: number | null // quarto
  suites: number | null // suite
  parkingSpots: number | null // vagas
  elevator: boolean | null // elevador
}

export async function getAllPropertyApproved({
  pageIndex,
  category,
  neighborhood,
  minPrice,
  maxPrice,
  typeOfProperty,
  bathrooms,
  bedrooms,
  suites,
  parkingSpots,
  elevator
}: GetAllPropetiesApprovedRequets) {
  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      statusPost: 'ACTIVE',

      category: {
        in: category ? [category] : ['SALE', 'RENT']
      },

      typeOfProperty: {
        in: typeOfProperty ? [typeOfProperty] : ['HOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'LOT', 'LAND', 'FARM', 'SHOPS', 'GARAGE', 'BUILDING', 'SHED', 'NO_RESIDENCIAL']
      },

      price: {
        gte: minPrice ?? 0,
        lte: maxPrice ?? Number.MAX_SAFE_INTEGER
      },

      neighborhood: {
        contains: neighborhood ?? '',
        mode: 'insensitive'
      },

      bathrooms: bathrooms !== null ? (bathrooms >= 5 ? { gte: 5 } : bathrooms) : undefined,
      bedrooms: bedrooms !== null ? (bedrooms >= 5 ? { gte: 5 } : bedrooms) : undefined,
      suites: suites !== null ? (suites >= 5 ? { gte: 5 } : suites) : undefined,
      parkingSpots: parkingSpots !== null ? (parkingSpots >= 5 ? { gte: 5 } : parkingSpots) : undefined,
      elevator: elevator ?? undefined,
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
      statusPost: 'ACTIVE',

      category: {
        in: category ? [category] : ['SALE', 'RENT']
      },

      typeOfProperty: {
        in: typeOfProperty ? [typeOfProperty] : ['HOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'LOT', 'LAND', 'FARM', 'SHOPS', 'GARAGE', 'BUILDING', 'SHED', 'NO_RESIDENCIAL']
      },

      price: {
        gte: minPrice ?? 0,
        lte: maxPrice ?? Number.MAX_SAFE_INTEGER
      },

      neighborhood: {
        contains: neighborhood ?? '',
        mode: 'insensitive'
      },

      bathrooms: bathrooms !== null ? (bathrooms >= 5 ? { gte: 5 } : bathrooms) : undefined,
      bedrooms: bedrooms !== null ? (bedrooms >= 5 ? { gte: 5 } : bedrooms) : undefined,
      suites: suites !== null ? (suites >= 5 ? { gte: 5 } : suites) : undefined,
      parkingSpots: parkingSpots !== null ? (parkingSpots >= 5 ? { gte: 5 } : parkingSpots) : undefined,
      elevator: elevator ?? undefined,
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