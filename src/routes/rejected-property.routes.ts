import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { rejectedProperty } from '../functions/rejected-property.ts'

export const rejectedPropertyRoutes: FastifyPluginCallbackZod = app => {
  app.patch(
    '/rejected-property/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Reject a property',
        params: z.object({
          propertyId: z.string(),
        }),
        response: {
          204: z.object(),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params

        await rejectedProperty({
          propertyId,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
