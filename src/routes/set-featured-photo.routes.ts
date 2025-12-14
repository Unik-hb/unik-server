import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { setFeaturedPhoto } from '../functions/set-featured-photo.ts'
import { PropertyNotFoundError } from '../functions/errors/property-not-found.ts'
import { PhotoNotFoundError } from '../functions/errors/photo-not-found.ts'

export const setFeaturedPhotoRoutes: FastifyPluginCallbackZod = app => {
  app.patch(
    '/properties/:propertyId/photos/featured',
    {
      schema: {
        tags: ['Properties'],
        description: 'Set a photo as featured (first position in carousel)',
        params: z.object({
          propertyId: z.uuid('ID da propriedade deve ser um UUID válido'),
        }),
        body: z.object({
          photoPath: z.string().min(1, 'O caminho da foto é obrigatório'),
        }),
        response: {
          200: z.object({
            message: z.string(),
            featuredPhoto: z.string(),
            photos: z.array(z.string()),
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

        const result = await setFeaturedPhoto({
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

        console.error('Erro ao definir foto como destaque:', error)
        return reply.status(500).send({
          message: error instanceof Error ? error.message : 'Erro interno do servidor'
        })
      }
    }
  )
}
