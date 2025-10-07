import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { userSchemaRequest } from '../models/user'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist'
import z from 'zod'
import { createUserAdmin } from '../functions/create-user-admin'

export const createUserAdminRoutes: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/create-admin',
    {
      schema: {
        tags: ['Users'],
        description: 'Create a new user admin (Adiministrador)',
        body: userSchemaRequest,
        response: {
          201: z.object({
            message: z.string().describe('Usuário criado com sucesso.'),
          }),
          409: z.object({
            message: z.string().describe('E-mail já está em uso, tente outro.'),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, password, photo } = request.body

        const { message } = await createUserAdmin({
          name,
          email,
          password,
          photo,
        })

        return reply.status(201).send({ message })
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(409).send({ message: error.message })
        }
      }
    }
  )
}
