import { prisma } from "../database/prisma.ts";

export async function getFeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      statusPost: "ACTIVE",
    },
    take: 3,

    include: {
      User: {
        select: {
          name: true,
          phone: true,
        },
      },
      owner: {
        select: {
          name: true,
          authorizationDocument: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    properties,
  };
}
