import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { searchFeaturedProperties } from '../functions/search-featured-properties'
import { propertiesSchemaResponse } from '../models/property'
import z, { ZodError } from 'zod'

export const searchFeaturedPropertiesRoutes: FastifyPluginCallbackZod = (
  app
) => {
  app.get(
    '/search-featured-properties',
    {
      schema: {
        tags: ['Properties'],
        description: 'Search featured properties',
        response: {
          200: propertiesSchemaResponse,
          400: z.object({
            message: z.string().describe(''),
          }),
        },
      },
    },
    async (_, reply) => {
      try {
        const { properties } = await searchFeaturedProperties()

        return reply.status(200).send({ properties })
      } catch (error) {
        if (error instanceof ZodError)
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
