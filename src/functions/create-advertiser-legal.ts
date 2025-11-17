import { hash } from 'bcryptjs'
import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'

type CreateAdvertiserLegalRequest = {
  name: string
  email: string
  password: string
  cnpj: string
}

export async function createAdvertiserLegal({
  name,
  email,
  password,
  cnpj,
}: CreateAdvertiserLegalRequest) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userAlreadyExists) {
    throw new UserAlreadyExistError()
  }

  const passwordHash = await hash(password, 8)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      cnpj,
      personType: 'COMPANY',
      role: 'ADVERTISER',
    },
  })
}
