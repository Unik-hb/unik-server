import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { getDetailsProperty } from '../functions/get-details-property.ts'

export const getDetailsPropertyRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/properties-details/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Get details of a property',
        params: z.object({
          propertyId: z.string(),
        }),
        response: {
          200: z.object({
            property: z.object({
              id: z.string(),
              status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
              title: z.string(),
              description: z.string().nullable(),
              category: z.enum(['SALE', 'RENT']).nullable(),
              typeOfProperty: z.enum(['HOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'LOT', 'LAND', 'FARM', 'SHOPS', 'GARAGE', 'BUILDING',
                'SHED', 'NO_RESIDENCIAL']).nullable(),
              iptu: z.number().nullable(),
              price: z.number(),
              condoFee: z.number().nullable(),
              photos: z.preprocess(
                value => (typeof value === 'string' ? JSON.parse(value) : value),
                z.array(z.string()).nullable()
              ),
              builtArea: z.string(),
              bedrooms: z.number(),
              suites: z.number(),
              parkingSpots: z.number(),
              address: z.string(),
              addressNumber: z.string().nullable(),
              uf: z.string().nullable(),
              bathrooms: z.number().nullable(),
              neighborhood: z.string(),
              city: z.string(),
              zipCode: z.string(),
              elevator: z.boolean(),
              airConditioning: z.boolean(),
              closet: z.boolean(),
              pool: z.boolean(),
              sevantsRoom: z.boolean(),
              terrace: z.boolean(),
              coworking: z.boolean(),
              gym: z.boolean(),
              gourmetArea: z.boolean(),
              partyRoom: z.boolean(),
              petArea: z.boolean(),
              playroom: z.boolean(),
              residential: z.boolean(),
              stairFlights: z.number().nullable(),
              ownerId: z.string().nullable(),
              usersId: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              updatedRegistry: z.string().nullable(),
              User: z.object({
                name: z.string(),
                email: z.string().nullable(),
                photo: z.string().nullable(),
                cnpj: z.string().nullable(),
                company: z.string().nullable(),
                rg: z.string().nullable(),
                cpf: z.string().nullable(),
                phone: z.string().nullable(),
                creci: z.string().nullable(),
                photoCreci: z.string().nullable(),
              }).nullable(),
              owner: z.object({
                name: z.string().nullable(),
                phone: z.string().nullable(),
                email: z.string().nullable(),
                authorizationDocument: z.string().nullable(),
              }).nullable(),
            }).nullable(),
          }),
          400: z.object({
            message: z.string(),
          }),
        }
      },
    },
    async (request, reply) => {
      try {

        const { propertyId } = request.params

        const { property } = await getDetailsProperty({
          propertyId
        })

        return reply.status(200).send({
          property,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
