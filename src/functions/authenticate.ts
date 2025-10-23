import { compare } from 'bcryptjs'
import { prisma } from '../database/prisma.ts'
import { IncorrectEmailOrPasswordError } from './errors/incorrect-email-or-password.ts'

interface AuthenticateProps {
  email: string
  password: string
}

export async function authenticate({ email, password }: AuthenticateProps) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new IncorrectEmailOrPasswordError()
  }

  const passwordCompare = await compare(password, user.password)

  if (!passwordCompare) {
    throw new IncorrectEmailOrPasswordError()
  }

  return { user }
}
