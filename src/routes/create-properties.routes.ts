import type { MultipartFile, MultipartValue } from '@fastify/multipart'
import type { InputJsonValue } from '@prisma/client/runtime/client'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z, { ZodError } from 'zod'
import { createProperties } from '../functions/create-properties.ts'
import { AllowedTypesImagesError } from '../functions/errors/allowed-types-images.ts'
import { Maximum15PhotosPerAdError } from '../functions/errors/maximum-15-photos-per-ad.ts'

export const createPropertiesRoutes: FastifyPluginCallbackZod = app => {
  app.post(
    '/create-property',
    {
      schema: {
        tags: ['Properties'],
        description: 'Create a new property listing',
        consumes: ['multipart/form-data'],

        body: z.object({
          title: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          iptu: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          addressNumber: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ),

          description: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          price: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          address: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          city: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          uf: z.preprocess(file => (file as MultipartValue).value, z.string()),

          bathrooms: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          neighborhood: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          zipCode: z.preprocess(
            file => (file as MultipartValue).value,
            z.string().trim()
          ),

          photos: z
            .custom<MultipartFile>()
            .refine(file => file.file)
            .refine(
              file => !file || file.file.bytesRead <= 1 * 1024 * 1024,
              'File size must be less than 1MB'
            )
            .refine(file => !file || file.mimetype.startsWith('image'), {
              message: 'File must be an image',
            })
            .array()
            .optional(),

          category: z.preprocess(
            file => (file as MultipartValue).value,
            z.enum(['SALE', 'RENT'])
          ),

          condoFee: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          builtArea: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ),

          bedrooms: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          suites: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          updatedRegistry: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ),

          parkingSpots: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          typeOfProperty: z.preprocess(
            file => (file ? (file as MultipartValue).value : undefined),
            z
              .enum([
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
              .optional()
          ),

          elevator: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          airConditioning: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          closet: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          pool: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          sevantsRoom: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          terrace: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          coworking: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          gourmetArea: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          gym: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          partyRoom: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          petArea: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          playroom: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          usersId: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ),


          ownerId: z
            .preprocess(file => (file as MultipartValue).value, z.string())
            .optional(),

          residential: z.preprocess(
            val => (val as MultipartValue)?.value === 'true' ? true : false,
            z.coerce.boolean()
          ),

          stairFlights: z.preprocess(
            file => (file as MultipartValue).value,
            z.coerce.number()
          ),

          nameOwner: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          rgOwner: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          cpfOwner: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          emailOwner: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          phoneOwner: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          authorizationDocumentOwner: z
            .custom<MultipartFile>()
            .refine(file => file.file)
            .refine(file => !file || file.mimetype.startsWith('image'), {
              message: 'File must be an image',
            })
            .optional(),

          creciDocument: z
            .custom<MultipartFile>()
            .refine(file => file.file)
            .refine(file => !file || file.mimetype.startsWith('image') || file.mimetype === 'application/pdf', {
              message: 'File must be an image or PDF',
            })
            .optional(),

          userType: z.preprocess(
            file => (file as MultipartValue).value,
            z.enum(['owner', 'mandatary', 'broker', 'legalEntity'])
          ),

          name: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          company: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          cnpj: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          cpf: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          rg: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          phone: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          email: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

          creci: z.preprocess(
            file => (file as MultipartValue).value,
            z.string()
          ).optional(),

        }),

        response: {
          201: z.object({
            message: z.string().describe('Anúncio criado com sucesso.'),
          }),
          400: z.object({
            message: z.string().describe(''),
          }),
          500: z.object({
            message: z.string().describe(''),
          }),
        },
      },
    },
    async (request, reply) => {
      try {

        const {
          title,
          addressNumber,
          description,
          category,
          price,
          iptu,
          condoFee,
          photos,
          builtArea,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathrooms,
          neighborhood,
          city,
          zipCode,
          elevator,
          airConditioning,
          closet,
          pool,
          sevantsRoom,
          terrace,
          typeOfProperty,
          coworking,
          gourmetArea,
          gym,
          ownerId,
          partyRoom,
          petArea,
          playroom,
          residential,
          stairFlights,
          usersId,
          updatedRegistry,
          userType,
          nameOwner,
          rgOwner,
          cpfOwner,
          emailOwner,
          phoneOwner,
          authorizationDocumentOwner,
          creciDocument,
          name,
          company,
          cnpj,
          cpf,
          rg,
          phone,
          email,
          creci,
        } = request.body

        const { message } = await createProperties({
          title,
          addressNumber,
          description,
          category,
          price,
          condoFee,
          photos: photos as InputJsonValue[] | undefined,
          builtArea,
          iptu,
          bedrooms,
          suites,
          parkingSpots,
          address,
          uf,
          bathrooms,
          neighborhood,
          city,
          zipCode,
          usersId,
          elevator,
          airConditioning,
          closet,
          pool,
          sevantsRoom,
          terrace,
          typeOfProperty,
          coworking,
          gourmetArea,
          gym,
          ownerId,
          partyRoom,
          petArea,
          playroom,
          residential,
          stairFlights,
          updatedRegistry,
          userType,
          nameOwner,
          rgOwner,
          cpfOwner,
          emailOwner,
          phoneOwner,
          authorizationDocumentOwner,
          creciDocument,
          name,
          company,
          cnpj,
          cpf,
          rg,
          phone,
          email,
          creci,
        })

        return reply.status(201).send({ message })
      } catch (error) {
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
