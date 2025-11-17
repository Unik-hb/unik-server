import { prisma } from "../database/prisma.ts"

interface ApprovedPropertyRequest {
  propertyId: string
}

export async function approvedProperty({ propertyId }: ApprovedPropertyRequest) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      status: "APPROVED"
    }
  })

  return
}