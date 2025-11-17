import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { revisionProperty } from '../functions/revision-property.ts'

export const revisionPropertyRoutes: FastifyPluginCallbackZod = app => {
  app.patch(
    '/revision-property/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Revision a property',
        params: z.object({
          propertyId: z.string()
        }),

        body: z.object({
          motive: z.string()
        }),
        response: {
          204: z.object(),
          400: z.object({
            message: z.string()
          })
        },
      },
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params
        const { motive } = request.body

        await revisionProperty({
          propertyId,
          motive
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
