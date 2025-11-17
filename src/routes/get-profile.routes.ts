import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { getProfile } from '../functions/get-profile.ts'
import { ensureAuthenticate } from '../middleware/ensure-authenticate.ts'

export const getProfileRoutes: FastifyPluginCallbackZod = app => {
  app.get(
    '/me',
    {
      onRequest: [ensureAuthenticate],
      schema: {
        tags: ['Users'],
        description: 'Get user profile',
        response: {
          200: z.object({
            user: z
              .object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                description: z.string().nullable(),
                phone: z.string().nullable(),
                photo: z.string().nullable(),
                cpf: z.string().nullable(),
                cnpj: z.string().nullable(),
                company: z.string().nullable(),
                role: z.enum(['ADMIN', 'ADVERTISER', 'BROKER']),
              })
              .nullable(),
          }),
          400: z.object({
            message: z.string(),
          }),
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
