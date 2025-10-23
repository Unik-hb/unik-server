import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { getProfile } from '../functions/get-profile.ts'
import { ensureAuthenticate } from '../middleware/ensure-authenticate.ts'
import { getProfileSchemaResponse } from '../models/user.ts'

export const getProfileRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/me',
    {
      onRequest: [ensureAuthenticate],
      schema: {
        tags: ['Users'],
        description: 'Get user profile',
        response: {
          200: getProfileSchemaResponse,
          400: {
            message: z.string().describe(''),
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { sub: id } = request.user as { sub: string }

        const { user } = await getProfile({
          usersId: id,
        })

        return reply.status(200).send({
          user,
        })
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
