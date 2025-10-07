import { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma'
import { UserAlreadyExistError } from './errors/user-already-exist'
import { hash } from 'bcryptjs'

export async function createUserBroker({
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
      role: 'BROKER',
      photo,
    },
  })

  return {
    message: 'Usuário criado com sucesso.',
  }
}
