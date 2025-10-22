import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../app.ts'

test('(E2E) Create an advertiser', async () => {
  await app.ready()

  const response = await request(app.server)
    .post('/users/create-advertiser-legal')
    .set('Content-Type', 'application/json')
    .send({
      name: 'John Doe',
      company: 'John Doe Company',
      email: 'johndoe@example.com',
      phone: '123456789',
      cnpj: '12345678901234',
      password: '12345678',
      photo: 'https://example.com/photo.jpg',
    })

  expect(response.statusCode).toEqual(201)
  expect(response.body).toEqual({
    message: 'Usuário criado com sucesso.',
  })
})
