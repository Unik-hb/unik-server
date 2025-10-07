import { test, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

test('(E2E) Create an broker', async () => {
  await app.ready()

  const response = await request(app.server)
    .post('/users/create-broker')
    .set('Content-Type', 'application/json')
    .send({
      name: 'Jessie Doe',
      email: 'Jessie@example.com',
      password: '12345678',
      photo: 'https://example.com/photo.jpg',
    })

  expect(response.statusCode).toEqual(201)
  expect(response.body).toEqual({
    message: 'Usuário criado com sucesso.',
  })
})
