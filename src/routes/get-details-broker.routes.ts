import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getDetailsBroker } from '../functions/get-details-broker.ts'
import { getDetailsBrokerSchemaResponse } from '../models/user.ts'

export const getDetailsBrokerRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/get-properties-by-broker/:usersId',
    {
      schema: {
        tags: ['Users'],
        description: 'Get details broker',
        params: z.object({
          usersId: z.string(),
        }),
        response: {
          200: getDetailsBrokerSchemaResponse,
          500: {
            message: z.string().describe(''),
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { usersId } = request.params

        const { broker } = await getDetailsBroker({
          usersId,
        })

        return reply.status(200).send({ broker })
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message })
        }
      }
    }
  )
}
