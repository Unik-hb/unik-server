import { prisma } from "../database/prisma.ts"

interface RevisionPropertyRequest {
  propertyId: string
  motive: string
}

export async function revisionProperty({ propertyId, motive }: RevisionPropertyRequest) {
  await prisma.property.update({
    where: {
      id: propertyId
    },
    data: {
      motiveRevision: motive,
      status: "REVISION"
    }
  })

  return
}