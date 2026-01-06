import type { MultipartFile, MultipartValue } from '@fastify/multipart'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { AllowedTypesImagesError } from '../functions/errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from '../functions/errors/maximum-15-photos-per-ad.ts'
import { PropertyNotFoundError } from '../functions/errors/property-not-found.ts'
import { propertyReview } from '../functions/property-review.ts'

export const propertyReviewRoutes: FastifyPluginCallbackZod = app => {
  app.put(
    '/properties/review/:propertyId',
    {
      schema: {
        tags: ['Properties'],
        description: 'Update property under revision and resubmit for approval',
        consumes: ['multipart/form-data'],

        params: z.object({
          propertyId: z.string().uuid(),
        }),

        body: z.object({
          title: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          description: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          category: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.enum(['SALE', 'RENT'])
            )
            .optional(),

          typeOfProperty: z
            .preprocess(
              file => (file ? (file as MultipartValue).value : undefined),
              z.enum([
                'HOUSE',
                'APARTMENT',
                'STUDIO',
                'LOFT',
                'LOT',
                'LAND',
                'FARM',
                'SHOPS',
                'GARAGE',
                'BUILDING',
                'SHED',
                'NO_RESIDENCIAL',
              ])
            )
            .optional(),

          iptu: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          price: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          condoFee: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          builtArea: z
            .preprocess(file => (file as MultipartValue)?.value, z.string())
            .optional(),

          bedrooms: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          suites: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          bathrooms: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          parkingSpots: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          updatedRegistry: z
            .preprocess(file => (file as MultipartValue)?.value, z.string())
            .optional(),

          address: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          addressNumber: z
            .preprocess(file => (file as MultipartValue)?.value, z.string())
            .optional(),

          uf: z
            .preprocess(file => (file as MultipartValue)?.value, z.string())
            .optional(),

          neighborhood: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          city: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          zipCode: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.string().trim()
            )
            .optional(),

          stairFlights: z
            .preprocess(
              file => (file as MultipartValue)?.value,
              z.coerce.number()
            )
            .optional(),

          elevator: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          airConditioning: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          pool: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          sevantsRoom: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          terrace: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          closet: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          residential: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          gourmetArea: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          gym: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          coworking: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          playroom: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          petArea: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          partyRoom: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),

          photos: z
            .custom<MultipartFile>()
            .refine(file => file.file)
            .refine(
              file => !file || file.file.bytesRead <= 2 * 1024 * 1024,
              'File size must be less than 2MB'
            )
            .refine(file => !file || file.mimetype.startsWith('image'), {
              message: 'File must be an image',
            })
            .array()
            .optional(),

          keepExistingPhotos: z
            .preprocess(
              val => (val as MultipartValue)?.value === 'true',
              z.coerce.boolean()
            )
            .optional(),
        }),

        response: {
          200: z.object({
            message: z
              .string()
              .describe(
                'Propriedade atualizada e enviada para análise com sucesso'
              ),
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
        const {
          title,
          description,
          category,
          typeOfProperty,
          iptu,
          price,
          condoFee,
          builtArea,
          bedrooms,
          suites,
          bathrooms,
          parkingSpots,
          updatedRegistry,
          address,
          addressNumber,
          uf,
          neighborhood,
          city,
          zipCode,
          stairFlights,
          elevator,
          airConditioning,
          pool,
          sevantsRoom,
          terrace,
          closet,
          residential,
          gourmetArea,
          gym,
          coworking,
          playroom,
          petArea,
          partyRoom,
          photos,
          keepExistingPhotos,
        } = request.body

        const { message } = await propertyReview({
          propertyId,
          title,
          description,
          category,
          typeOfProperty,
          iptu,
          price,
          condoFee,
          builtArea,
          bedrooms,
          suites,
          bathrooms,
          parkingSpots,
          updatedRegistry,
          address,
          addressNumber,
          uf,
          neighborhood,
          city,
          zipCode,
          stairFlights,
          elevator,
          airConditioning,
          pool,
          sevantsRoom,
          terrace,
          closet,
          residential,
          gourmetArea,
          gym,
          coworking,
          playroom,
          petArea,
          partyRoom,
          photos,
          keepExistingPhotos,
        })

        return reply.status(200).send({ message })
      } catch (error) {
        if (error instanceof PropertyNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        if (error instanceof Maximum15PhotosPerAdError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof AllowedTypesImagesError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message })
        }

        if (error instanceof Error) {
          return reply.status(500).send({ message: error.message })
        }
      }
    }
  )
}
