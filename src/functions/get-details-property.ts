import { prisma } from '../database/prisma.ts'

interface GetPropertyDetailsProps {
  propertyId: string
}

export async function getDetailsProperty({
  propertyId,
}: GetPropertyDetailsProps) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
    },
  })

  return {
    property,
  }
}
