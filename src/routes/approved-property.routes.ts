import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { approvedProperty } from '../functions/approved-property.ts'

export const approvedPropertyRoutes: FastifyPluginCallbackZod = app => {
  app.patch(
    '/approved-property/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Approve a property',
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

        await approvedProperty({
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
