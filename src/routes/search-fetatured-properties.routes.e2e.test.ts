import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../app.ts'

test('(E2E) Search featured properties', async () => {
  await app.ready()

  const response = await request(app.server).get(
    '/properties/search-featured-properties'
  )

  expect(response.statusCode).toEqual(200)
  expect(response.body).toEqual({
    properties: expect.any(Array),
  })
})
