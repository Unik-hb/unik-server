import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'
import { hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'

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

  const user = await prisma.user.create({
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
    id: user.id,
    message: 'Usuário criado com sucesso.',
  }
}
