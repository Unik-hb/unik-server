import type { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'

export async function createUserAdmin({
  name,
  email,
  password,
  photo,
}: Prisma.UserCreateInput) {
  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userExist) {
    throw new UserAlreadyExistError()
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: 'ADMIN',
      photo,
    },
  })

  return {
    message: 'Usuário criado com sucesso.',
  }
}
