import { prisma } from "../database/prisma.ts"

interface StatePropertyRequets {
  propertyId: string
  state: 'ACTIVE' | 'INACTIVE'
}

export async function stateProperty({ propertyId, state }: StatePropertyRequets) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      state: state
    }
  })
}