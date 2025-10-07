import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { userSchemaRequest } from '../models/user'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist'
import z from 'zod'
import { createUserAdvertiserLegal } from '../functions/create-user-edvertiser-legal'

export const createUserAdvertiserLegalRoutes: FastifyPluginCallbackZod = (
  app
) => {
  app.post(
    '/create-advertiser-legal',
    {
      schema: {
        tags: ['Users'],
        description: 'Create a new advertiser legal (Anunciante Juridico)',
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
        const { name, company, email, phone, cnpj, password, photo } =
          request.body

        const { id, message } = await createUserAdvertiserLegal({
          name,
          company,
          email,
          phone,
          cnpj,
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
