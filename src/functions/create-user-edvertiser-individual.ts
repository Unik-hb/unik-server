import type { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'

export async function createUserAdvertiserIndividual({
  name,
  email,
  cpf,
  phone,
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
      cpf,
      phone,
      password: passwordHash,
      personType: 'INDIVIDUAL',
      role: 'ADVERTISER',
      photo,
    },
  })

  return {
    message: 'Usuário criado com sucesso.',
  }
}
