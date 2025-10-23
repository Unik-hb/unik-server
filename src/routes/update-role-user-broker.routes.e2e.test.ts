import request from 'supertest'
import { expect, test } from 'vitest'
import { makeUsers } from '../../tests/factories/make-users.ts'
import { app } from '../app.ts'

test('(E2E) Update user role broker', async () => {
  await app.ready()

  const user = await makeUsers()

  const response = await request(app.server)
    .patch('/users/update-role-user-broker')
    .set('Content-Type', 'application/json')
    .send({
      email: user.email,
    })

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    message: 'Usuário agora é um corretor.',
  })
})
