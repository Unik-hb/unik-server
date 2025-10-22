import request from 'supertest'
import { expect, test } from 'vitest'
import { makeUsers } from '../../tests/factories/make-users.ts'
import { app } from '../app.ts'

test('(E2E) Create new property listing', async () => {
  await app.ready()

  const { usersId } = await makeUsers()

  const response = await request(app.server)
    .post(`/properties/create-property/${usersId}`)
    .set('Content-Type', 'multipart/form-data')
    .field('title', 'Casa 1')
    .field('description', 'Casa 1')
    .field('category', 'SALE')
    .field('price', 100000)
    .field('condoFee', 1000)
    .field('monthlyTax', 100)
    .field('builtArea', 100)
    .field('bedrooms', 2)
    .field('suites', 1)
    .field('parkingSpots', 1)
    .field('address', 'Rua 1')
    .field('uf', 'SP')
    .field('bathroon', 1)
    .field('neighborhood', 'Bairro 1')
    .field('city', 'Cidade 1')
    .field('zipCode', '36013100')
    .field('elevator', true)
    .field('airConditioning', true)
    .field('closet', true)
    .field('pool', true)
    .field('sevantsRoom', true)
    .field('terrace', true)

  expect(response.statusCode).toEqual(201)
  expect(response.body).toEqual({
    message: 'Anúncio criado com sucesso.',
  })
})
