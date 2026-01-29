import { prisma } from "../database/prisma.ts";

interface EditReceivedPropertyRequest {
  propertyId: string;
  title: string;
  description: string;
  iptu?: number;
  price?: number;
  condoFee?: number;
}

export async function editReceivedPropety({
  propertyId,
  title,
  description,
  iptu,
  price,
  condoFee,
}: EditReceivedPropertyRequest) {
  await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      title,
      description,
      price,
      condoFee,
      iptu,
    },
  });

  return {
    message: "Editado com sucesso",
  };
}
