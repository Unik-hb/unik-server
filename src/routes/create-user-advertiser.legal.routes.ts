import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createUserAdvertiserLegal } from '../functions/create-user-edvertiser-legal.ts'
import { UserAlreadyExistError } from '../functions/errors/user-already-exist.ts'
import { userSchemaRequest } from '../models/user.ts'

export const createUserAdvertiserLegalRoutes: FastifyPluginCallbackZod =
  app => {
    app.post(
      '/create-advertiser-legal',
      {
        schema: {
          tags: ['Users'],
          description: 'Create a new advertiser legal (Anunciante Juridico)',
          body: userSchemaRequest,
          response: {
            201: z.object({
              message: z.string().describe('Usuário criado com sucesso.'),
            }),
            409: z.object({
              message: z
                .string()
                .describe('E-mail já está em uso, tente outro.'),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const { name, company, email, phone, cnpj, password, photo } =
            request.body

          const { message } = await createUserAdvertiserLegal({
            name,
            company,
            email,
            phone,
            cnpj,
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
