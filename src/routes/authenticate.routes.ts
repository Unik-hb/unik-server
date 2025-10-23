import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticate } from '../functions/authenticate.ts'
import { IncorrectEmailOrPasswordError } from '../functions/errors/incorrect-email-or-password.ts'

export const authenticateRoutes: FastifyPluginCallbackZod = app => {
  app.post(
    '/authenticate',
    {
      schema: {
        tags: ['Authenticate'],
        description: 'Authenticate user',
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const { user } = await authenticate({
          email,
          password,
        })

        const token = await reply.jwtSign({
          sub: user.id,
        })

        reply.setCookie('token', token, {
          path: '/',
          secure: true,
          sameSite: 'none',
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return reply.status(200).send()
      } catch (error) {
        if (error instanceof IncorrectEmailOrPasswordError) {
          return reply.status(401).send({ message: error.message })
        }
      }
    }
  )
}
