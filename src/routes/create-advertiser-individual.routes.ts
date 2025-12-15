import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAdvertiserIndividual } from '../functions/create-advertiser-individual.ts'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist.ts'

export const createAdvertiserIndividualRoutes: FastifyPluginCallbackZod =
  app => {
    app.post(
      '/create-advertiser-individual',
      {
        schema: {
          tags: ['Users'],
          description: 'Create a new advertiser individual',
          body: z.object({
            name: z.string(),
            email: z.email(),
            password: z.string(),
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
          const { name, email, password } = request.body

          await createAdvertiserIndividual({
            name,
            email,
            password
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
