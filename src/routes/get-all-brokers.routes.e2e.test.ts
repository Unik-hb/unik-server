import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../app.ts'

test('(E2E) Get all brokers', async () => {
  app.ready()

  const response = await request(app.server).get('/users/get-all-brokers')

  expect(response.statusCode).toEqual(200)
})
