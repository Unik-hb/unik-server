import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { getDetailsProperty } from '../functions/get-details-property.ts'
import { getDetailsPropertySchemaResponse } from '../models/property.ts'

export const getDetailsPropertyRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/get-details-property/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Get details property',
        params: z.object({
          propertyId: z.string(),
        }),
        response: {
          200: getDetailsPropertySchemaResponse,
          400: z.object({
            message: z.string().describe(''),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params

        const { property } = await getDetailsProperty({
          propertyId,
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
