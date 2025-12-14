import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { deletePropertyPhoto } from '../functions/delete-property-photo.ts'
import { PropertyNotFoundError } from '../functions/errors/property-not-found.ts'
import { PhotoNotFoundError } from '../functions/errors/photo-not-found.ts'

export const deletePropertyPhotoRoutes: FastifyPluginCallbackZod = app => {
  app.delete(
    '/properties/:propertyId/photos',
    {
      schema: {
        tags: ['Properties'],
        description: 'Delete a photo from a property',
        params: z.object({
          propertyId: z.string().uuid('ID da propriedade deve ser um UUID válido'),
        }),
        body: z.object({
          photoPath: z.string().min(1, 'O caminho da foto é obrigatório'),
        }),
        response: {
          200: z.object({
            message: z.string(),
            remainingPhotos: z.array(z.string()),
          }),
          400: z.object({
            message: z.string(),
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
        const { photoPath } = request.body

        const result = await deletePropertyPhoto({
          propertyId,
          photoPath,
        })

        return reply.status(200).send(result)
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof PhotoNotFoundError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof Error && error.message === 'Propriedade não possui fotos') {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }

        console.error('Erro ao deletar foto:', error)
        return reply.status(500).send({
          message: error instanceof Error ? error.message : 'Erro interno do servidor'
        })
      }
    }
  )
}
