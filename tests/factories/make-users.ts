import { prisma } from '../../src/database/prisma'

export async function makeUsers() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123456789',
      cpf: '09009009099',
      password: '12345678',
      photo: 'https://example.com/photo.jpg',
      role: 'ADVERTISER',
      personType: 'INDIVIDUAL',
    },
  })

  return {
    usersId: user.id,
  }
}
