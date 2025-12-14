import { prisma } from "../database/prisma.ts";

interface GetDetailsPropetyRequest {
  propertyId: string;
}

export async function getDetailsProperty({ propertyId }: GetDetailsPropetyRequest) {

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
    },

    include: {
      owner: {
        select: {
          name: true,
          phone: true,
          email: true,
          authorizationDocument: true
        }
      },
      User: {
        select: {
          name: true,
          phone: true,
          creci: true,
          photoCreci: true,
          cnpj: true,
          company: true,
          rg: true,
          cpf: true,
          email: true,
          photo: true,
        }
      },
    }
  })

  return {
    property,
  }
}