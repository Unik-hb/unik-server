import { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma'

export async function createPropertyListing({
  title,
  description,
  category,
  price,
  condoFee,
  monthlyTax,
  photos,
  builtArea,
  bedrooms,
  suites,
  parkingSpots,
  address,
  uf,
  neighborhood,
  city,
  zipCode,
  usersId,
  elevator,
  bathroon,
}: Prisma.PropertyCreateManyInput) {
  await prisma.property.create({
    data: {
      title,
      description,
      category,
      price,
      condoFee,
      monthlyTax,
      photos,
      builtArea,
      bedrooms,
      suites,
      parkingSpots,
      address,
      uf,
      neighborhood,
      city,
      zipCode,
      usersId,
      elevator,
      bathroon,
    },
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
