import { MultipartFile, MultipartValue } from '@fastify/multipart'
import z from 'zod'

export const propertySchemaRequest = z.object({
  title: z.preprocess((file) => (file as MultipartValue).value, z.string()),

  description: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.string()
  ),

  price: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  address: z.preprocess((file) => (file as MultipartValue).value, z.string()),

  city: z.preprocess((file) => (file as MultipartValue).value, z.string()),

  uf: z.preprocess((file) => (file as MultipartValue).value, z.string()),

  bathroon: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  neighborhood: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.string()
  ),

  zipCode: z.preprocess((file) => (file as MultipartValue).value, z.string()),

  photos: z
    .custom<MultipartFile>()
    .refine((file) => file.file)
    .refine(
      (file) => !file || file.file.bytesRead <= 1 * 1024 * 1024,
      'File size must be less than 1MB'
    )
    .refine((file) => !file || file.mimetype.startsWith('image'), {
      message: 'File must be an image',
    })
    .array()
    .optional(),

  category: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.enum(['SALE', 'RENT'])
  ),

  condoFee: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  monthlyTax: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  builtArea: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  bedrooms: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  suites: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  parkingSpots: z.preprocess(
    (file) => (file as MultipartValue).value,
    z.coerce.number()
  ),

  elevator: z.preprocess(
    (file) => file ? (file as MultipartValue).value : undefined,
    z.coerce.boolean().optional().default(false)
  ),
})
