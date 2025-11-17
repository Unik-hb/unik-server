import { prisma } from "../database/prisma.ts"

interface RejectedPropertyRequest {
  propertyId: string
}

export async function rejectedProperty({ propertyId }: RejectedPropertyRequest) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      status: "REJECTED"
    }
  })

  return
}