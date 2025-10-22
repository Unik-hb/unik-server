import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.ts'
import { UserNotFoundError } from './errors/user-not-found.ts'

export async function updateRoleUserBroker({
  email,
}: Omit<Prisma.UserCreateInput, 'name' | 'password'>) {
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!userExist) {
    throw new UserNotFoundError()
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: 'BROKER',
    },
  })

  return {
    message: 'Usuário agora é um corretor.',
  }
}
