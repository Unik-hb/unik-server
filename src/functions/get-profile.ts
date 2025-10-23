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
      photo: true,
    },
  })

  return {
    user,
  }
}
