import { test, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

test('(E2E) Create new property listing', async () => {
  await app.ready()

  const response = await request(app.server)
    .post(`/properties/create-property/userID`)
    .set('Content-Type', 'multipart/form-data')
    .field('title', 'Casa 1')
    .field('description', 'Casa 1')
    .field('category', 'SALE')
    .field('price', 100000)
    .field('condoFee', '1000')
    .field('monthlyTax', 100)
    .field('builtArea', '100')
    .field('bedrooms', 2)
    .field('suites', 1)
    .field('parkingSpots', 1)
    .field('address', 'Rua 1')
    .field('street', 'Rua 1')
    .field('number', '1')
    .field('neighborhood', 'Bairro 1')
    .field('city', 'Cidade 1')
    .field('zipCode', '36013100')

  expect(response.statusCode).toEqual(201)
  expect(response.body).toEqual({
    id: expect.any(String),
    message: 'Anúncio criado com sucesso.',
  })
})
