import { prisma } from '../database/prisma.ts'

interface GetProfileProps {
  usersId: string
}

export async function getProfile({ usersId }: GetProfileProps) {
  const user = await prisma.user.findFirst({
    where: {
      id: usersId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      description: true,
      cpf: true,
      rg: true,
      creci: true,
      cnpj: true,
      company: true,
      role: true,
      photo: true,
    },
  })

  return {
    user,
  }
}
