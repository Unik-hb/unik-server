import { expect, test, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('(E2E) Get All Properties', () => {
  test('should get all properties', async () => {
    await app.ready()

    const response = await request(app.server).get('/properties')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      properties: expect.any(Array),
      metas: {
        totalCount: expect.any(Number),
        totalPages: expect.any(Number),
      },
    })
  })
})
