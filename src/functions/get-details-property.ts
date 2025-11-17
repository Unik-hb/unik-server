import { prisma } from "../database/prisma.ts";

interface GetDetailsPropetyRequest {
  propertyId: string;
}

export async function getDetailsProperty({ propertyId }: GetDetailsPropetyRequest) {
  console.log('propertyId', propertyId);
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
    },

    include: {
      owner: {
        select: {
          name: true,
          authorizationDocument: true
        }
      },
      User: {
        select: {
          name: true,
          phone: true
        }
      },
    }
  })

  return {
    property,
  }
}