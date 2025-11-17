import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAdvertiserLegal } from '../functions/create-advertiser-legal.ts'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist.ts'

export const createAdvertiserLegalRoutes: FastifyPluginCallbackZod = app => {
  app.post(
    '/create-advertiser-legal',
    {
      schema: {
        tags: ['Users'],
        description: 'Create a new advertiser legal',
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string(),
          cnpj: z.string(),
        }),

        response: {
          201: z.object(),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, password, cnpj } = request.body

        await createAdvertiserLegal({
          name,
          email,
          password,
          cnpj,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(400).send({ message: error.message })
        }
      }
    }
  )
}
