import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { propertySchemaRequest } from '../models/property'
import { userIdSchemaRequest } from '../models/user'
import { createPropertyListing } from '../functions/create-property-listing'
import { InputJsonValue } from '@prisma/client/runtime/client'
import z, { ZodError } from 'zod'

export const createPropertyListingRoutes: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/create-property/:usersId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Create a new property listing',
        params: userIdSchemaRequest,
        body: propertySchemaRequest,
        response: {
          201: z.object({
            message: z.string().describe('Anúncio criado com sucesso.'),
          }),
          500: z.object({
            message: z.string().describe(''),
          }),
          400: z.object({
            message: z.string().describe(''),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const {
          title,
          description,
          category,
          price,
          condoFee,
          monthlyTax,
          photos,
          builtArea,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathroon,
          neighborhood,
          city,
          zipCode,
          elevator,
        } = request.body

        const { usersId } = request.params

        const { message } = await createPropertyListing({
          title,
          description,
          category,
          price,
          condoFee,
          monthlyTax,
          photos: photos as InputJsonValue[] | undefined,
          builtArea,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathroon,
          neighborhood,
          city,
          zipCode,
          usersId,
          elevator,
        })

        return reply.status(201).send({ message })
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message })
        }

        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
