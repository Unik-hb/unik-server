import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import {
  getAllPropertiesResponse,
  propertiesSchemaQuery,
} from '../models/property'
import { getAllProperties } from '../functions/get-all-properties'

export const getAllPropertiesRoutes: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/',
    {
      schema: {
        tags: ['Properties'],
        description: 'Get all properties',
        querystring: propertiesSchemaQuery,
        response: {
          200: getAllPropertiesResponse,
          400: z.object({
            message: z.string().describe(''),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const {
          pageIndex,
          title,
          address,
          category,
          priceMin,
          priceMax,
          bathroon,
          builtAreaMin,
          builtAreaMax,
          bedrooms,
          suites,
          elevator,
        } = request.query

        const { properties, metas } = await getAllProperties({
          pageIndex,
          title,
          address,
          category: category as 'RENT' | 'SALE' | undefined,
          priceMin,
          priceMax,
          bathroon,
          builtAreaMin,
          builtAreaMax,
          bedrooms,
          suites,
          elevator,
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
