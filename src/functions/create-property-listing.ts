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
  street,
  number,
  neighborhood,
  city,
  zipCode,
  usersId,
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
      street,
      number,
      neighborhood,
      city,
      zipCode,
      usersId,
      status: 'PENDING',
    },
  })

  return {
    message: 'Anúncio criado com sucesso.',
  }
}
