import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { UserNotFoundError } from '../functions/errors/user-not-found.ts'
import { updateRoleUserBroker } from '../functions/update-role-user-broker.ts'
import { userEmailSchemaRequest } from '../models/user.ts'

export const updateRoleUserBrokerRoutes: FastifyPluginCallbackZod = app => {
  app.patch(
    '/update-role-user-broker',
    {
      schema: {
        tags: ['Users'],
        description: 'Update user role (Corretor)',
        body: userEmailSchemaRequest,
        response: {
          200: z.object({
            message: z.string().describe('Usuário agora é um corretor.'),
          }),
          404: z.object({
            message: z.string().describe('Usuário não encontrado.'),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body

        const { message } = await updateRoleUserBroker({
          email,
        })

        return reply.status(200).send({ message })
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }
      }
    }
  )
}
