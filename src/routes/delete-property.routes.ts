import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteProperty } from '../functions/delete-property.ts'
import { PropertyNotFoundError } from '../functions/errors/property-not-found.ts'

export const deletePropertyRoutes: FastifyPluginCallbackZod = app => {
  app.delete(
    '/properties/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Delete a property and all its photos',
        params: z.object({
          propertyId: z
            .string()
            .uuid('ID da propriedade deve ser um UUID válido'),
        }),
        response: {
          200: z.object({
            message: z.string(),
            deletedPhotos: z.number(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params

        const result = await deleteProperty({ propertyId })

        return reply.status(200).send(result)
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error('Erro ao deletar propriedade:', error)
        return reply
          .status(500)
          .send({ message: 'Erro interno do servidor' })
      }
    }
  )
}
