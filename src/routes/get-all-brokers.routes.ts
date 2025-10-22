import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getAllBrokers } from '../functions/get-all-brokers.ts'
import { userBrokerSchemaResponse } from '../models/user.ts'

export const getAllBrokersRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/get-all-brokers',
    {
      schema: {
        tags: ['Users'],
        description: 'Get all users brokers',
        response: {
          200: userBrokerSchemaResponse,
          500: {
            message: z.string().describe(''),
          },
        },
      },
    },
    async (_, reply) => {
      try {
        const { brokers } = await getAllBrokers()

        return reply.status(200).send({ brokers })
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message })
        }
      }
    }
  )
}
