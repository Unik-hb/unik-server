import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { getAllPropertyApproved } from '../functions/get-all-property-approved.ts'

export const getAllPropertApprovedRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/properties-approved',
    {
      schema: {
        tags: ['Properties'],
        description: 'Get all approved properties',
        querystring: z.object({
          pageIndex: z.coerce.number().min(0).default(0),
        }),

        response: {
          200: z.object({
            properties: z.array(z.object({
              id: z.string(),
              status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
              title: z.string(),
              description: z.string().nullable(),
              category: z.enum(['SALE', 'RENT']).nullable(),
              typeOfProperty: z.enum(['HOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'LOT', 'LAND', 'FARM', 'SHOPS', 'GARAGE', 'NO_RESIDENCIAL']).nullable(),
              iptu: z.number().nullable(),
              price: z.number(),
              condoFee: z.number().nullable(),
              photos: z.preprocess(
                value => (typeof value === 'string' ? JSON.parse(value) : value),
                z.array(z.string()).nullable()
              ),
              builtArea: z.string(),
              bedrooms: z.string(),
              suites: z.string(),
              parkingSpots: z.string(),
              address: z.string(),
              addressNumber: z.string().nullable(),
              uf: z.string().nullable(),
              bathrooms: z.string().nullable(),
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
              stairFlights: z.string().nullable(),
              ownerId: z.string().nullable(),
              usersId: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              updatedRegistry: z.string().nullable(),
              User: z.object({
                name: z.string(),
                phone: z.string().nullable(),
              }).nullable(),
              owner: z.object({
                name: z.string(),
                authorizationDocument: z.string().nullable(),
              }).nullable(),
            })),
            metas: z.object({
              totalPages: z.number(),
              totalProperties: z.number(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        }
      },
    },
    async (request, reply) => {
      try {

        const { pageIndex } = request.query

        const { properties, metas } = await getAllPropertyApproved({
          pageIndex,
        })

        return reply.status(200).send({
          properties,
          metas,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
