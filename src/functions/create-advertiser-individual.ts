import { hash } from 'bcryptjs'
import { prisma } from '../database/prisma.ts'
import { UserAlreadyExistError } from './errors/user-already-exist.ts'

type CreateAdvertiserIndividualRequest = {
  name: string
  email: string
  password: string
  cpf: string
}

export async function createAdvertiserIndividual({
  name,
  email,
  password,
  cpf,
}: CreateAdvertiserIndividualRequest) {
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
      cpf,
      personType: 'INDIVIDUAL',
      role: 'ADVERTISER',
    },
  })
}
