import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../app.ts'

test('(E2E) Create an admin', async () => {
  await app.ready()

  const response = await request(app.server)
    .post('/users/create-admin')
    .set('Content-Type', 'application/json')
    .send({
      name: 'Sarah Doe',
      email: 'saradoe@example.com',
      password: '12345678',
      photo: 'https://example.com/photo.jpg',
    })

  expect(response.statusCode).toEqual(201)
  expect(response.body).toEqual({
    message: 'Usuário criado com sucesso.',
  })
})
