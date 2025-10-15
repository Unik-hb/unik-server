import { prisma } from '../database/prisma'

interface GetAllPropertiesQuery {
  pageIndex?: number
  title?: string
  address?: string
  category?: 'RENT' | 'SALE' | undefined
  priceMin?: number
  priceMax?: number
  builtAreaMin?: number
  builtAreaMax?: number
  bedrooms?: number
  suites?: number
  bathroon?: number
  elevator?: boolean
}

export async function getAllProperties({
  pageIndex,
  title,
  address,
  category,
  priceMin,
  priceMax,
  builtAreaMin,
  builtAreaMax,
  bedrooms,
  suites,
  bathroon,
  elevator,
}: GetAllPropertiesQuery) {
  const properties = await prisma.property.findMany({
    where: {
      title: {
        contains: title ?? '',
        mode: 'insensitive',
      },
      address: {
        contains: address ?? '',
        mode: 'insensitive',
      },
      category: {
        in: category ? [category] : undefined,
      },
      price: {
        gte: priceMin ? priceMin : undefined,
        lte: priceMax ? priceMax : undefined,
      },
      builtArea: {
        gte: builtAreaMin ? builtAreaMin : undefined,
        lte: builtAreaMax ? builtAreaMax : undefined,
      },
      bedrooms: {
        equals: bedrooms ? bedrooms : undefined,
      },
      suites: {
        equals: suites ? suites : undefined,
      },
      bathroon: {
        equals: bathroon ? bathroon : undefined,
      },
      elevator: {
        equals: elevator,
      },
    },

    take: 10,
    skip: Number(pageIndex) * 10,

    orderBy: {
      createdAt: 'desc',
    },
  })

  const totalCount = await prisma.property.count({
    where: {
      title: {
        contains: title ?? '',
        mode: 'insensitive',
      },

      address: {
        contains: address ?? '',
        mode: 'insensitive',
      },
      category: {
        in: category ? [category] : undefined,
      },
      price: {
        gte: priceMin ? priceMin : undefined,
        lte: priceMax ? priceMax : undefined,
      },
      builtArea: {
        gte: builtAreaMin ? builtAreaMin : undefined,
        lte: builtAreaMax ? builtAreaMax : undefined,
      },
      bedrooms: {
        equals: bedrooms ? bedrooms : undefined,
      },
      suites: {
        equals: suites ? suites : undefined,
      },
      bathroon: {
        equals: bathroon ? bathroon : undefined,
      },
      elevator: {
        equals: elevator,
      },
    },
  })

  const totalPages = Math.ceil(totalCount / 10) ?? 1

  return {
    properties,
    metas: {
      totalCount,
      totalPages,
    },
  }
}
