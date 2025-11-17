import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { stateProperty } from '../functions/state-property.ts'

export const statePropertyRoutes: FastifyPluginCallbackZod = app => {
  app.patch('/state-property/:propertyId', {
    schema: {
      tags: ['Properties'],
      description: 'Change the state of a property',
      params: z.object({
        propertyId: z.string(),
      }),
      body: z.object({
        state: z.enum(['ACTIVE', 'INACTIVE']),
      }),
      response: {
        204: z.object({}),
        400: z.object({
          message: z.string(),
        }),
      },
    },
  },
    async (request, reply) => {
      try {
        const { propertyId } = request.params
        const { state } = request.body

        await stateProperty({
          propertyId,
          state,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    })
}
