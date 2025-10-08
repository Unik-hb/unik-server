import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'
import { hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'

export async function createUserAdvertiserLegal({
  name,
  company,
  email,
  cnpj,
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
      company,
      email,
      cnpj,
      phone,
      password: passwordHash,
      personType: 'COMPANY',
      role: 'ADVERTISER',
      photo,
    },
  })

  return {
    message: 'Usuário criado com sucesso.',
  }
}
