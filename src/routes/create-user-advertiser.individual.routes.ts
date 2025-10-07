import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { userSchemaRequest } from '../models/user'
import { createUserAdvertiserIndividual } from '../functions/create-user-edvertiser-individual'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist'
import z from 'zod'

export const createUserAdvertiserIndividualRoutes: FastifyPluginCallbackZod = (
  app
) => {
  app.post(
    '/create-advertiser-individual',
    {
      schema: {
        tags: ['Users'],
        description:
          'Create a new advertiser individual (Anunciante individual)',
        body: userSchemaRequest,
        response: {
          201: z.object({
            id: z.uuid(),
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
        const { name, email, phone, cpf, password, photo } = request.body

        const { id, message } = await createUserAdvertiserIndividual({
          name,
          email,
          phone,
          cpf,
          password,
          photo,
        })

        return reply.status(201).send({ id, message })
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(409).send({ message: error.message })
        }
      }
    }
  )
}
