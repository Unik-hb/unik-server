import type { MultipartFile, MultipartValue } from '@fastify/multipart'
import z from 'zod'

export const propertySchemaRequest = z.object({
  title: z.preprocess(file => (file as MultipartValue).value, z.string()),

  description: z.preprocess(file => (file as MultipartValue).value, z.string()),

  price: z.preprocess(
    file => (file as MultipartValue).value,
    z.coerce.number()
  ),

  address: z.preprocess(file => (file as MultipartValue).value, z.string()),

  city: z.preprocess(file => (file as MultipartValue).value, z.string()),

  uf: z.preprocess(file => (file as MultipartValue).value, z.string()),

  bathroon: z.preprocess(
    file => (file as MultipartValue).value,
    z.coerce.number()
  ),

  neighborhood: z.preprocess(
    file => (file as MultipartValue).value,
    z.string()
  ),

  zipCode: z.preprocess(file => (file as MultipartValue).value, z.string()),

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

  monthlyTax: z.preprocess(
    file => (file as MultipartValue).value,
    z.coerce.number()
  ),

  builtArea: z.preprocess(
    file => (file as MultipartValue).value,
    z.coerce.number()
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
    z.coerce.number()
  ),

  parkingSpots: z.preprocess(
    file => (file as MultipartValue).value,
    z.coerce.number()
  ),

  elevator: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),

  airConditioning: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),

  closet: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),

  pool: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),

  sevantsRoom: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),

  terrace: z.preprocess(
    file => (file ? (file as MultipartValue).value : undefined),
    z.coerce.boolean().optional()
  ),
})

export const propertiesSchemaResponse = z.object({
  properties: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      category: z.enum(['SALE', 'RENT', '']),
      price: z.number(),
      condoFee: z.number(),
      monthlyTax: z.number(),
      photos: z.preprocess(
        value => (typeof value === 'string' ? JSON.parse(value) : value),
        z.array(z.string()).nullable()
      ),
      builtArea: z.number(),
      bedrooms: z.number(),
      suites: z.number(),
      bathroon: z.number().nullable(),
      parkingSpots: z.number(),
      updatedRegistry: z.number().nullable(),
      address: z.string(),
      uf: z.string().nullable(),
      neighborhood: z.string(),
      city: z.string(),
      zipCode: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
      usersId: z.string().nullable(),
      elevator: z.boolean().nullable(),
    })
    .array(),
})

export const propertiesSchemaQuery = z.object({
  pageIndex: z.coerce.number().min(0).default(0),
  title: z.string().optional(),
  neighborhood: z.string().optional(),
  category: z.enum(['SALE', 'RENT', '']).optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  builtAreaMin: z.coerce.number().optional(),
  builtAreaMax: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathroon: z.coerce.number().optional(),
  elevator: z
    .string()
    .transform(value => (value === 'true' ? true : false))
    .optional(),
})

export const getAllPropertiesResponse = z.object({
  properties: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      category: z.enum(['SALE', 'RENT', '']),
      price: z.number(),
      condoFee: z.number(),
      monthlyTax: z.number(),
      photos: z.preprocess(
        value => (typeof value === 'string' ? JSON.parse(value) : value),
        z.array(z.string()).nullable()
      ),
      builtArea: z.number(),
      bedrooms: z.number(),
      suites: z.number(),
      bathroon: z.number().nullable(),
      parkingSpots: z.number(),
      updatedRegistry: z.number().nullable(),
      address: z.string(),
      uf: z.string().nullable(),
      neighborhood: z.string(),
      city: z.string(),
      zipCode: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
      usersId: z.string().nullable(),
      elevator: z.boolean().nullable(),
    })
    .array(),

  metas: z.object({
    totalCount: z.number(),
    totalPages: z.number(),
  }),
})

export const getDetailsPropertySchemaResponse = z.object({
  property: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      category: z.enum(['SALE', 'RENT', '']),
      price: z.number(),
      condoFee: z.number(),
      monthlyTax: z.number(),
      photos: z.preprocess(
        value => (typeof value === 'string' ? JSON.parse(value) : value),
        z.array(z.string()).nullable()
      ),
      builtArea: z.number(),
      bedrooms: z.number(),
      suites: z.number(),
      bathroon: z.number().nullable(),
      parkingSpots: z.number(),
      updatedRegistry: z.number().nullable(),
      address: z.string(),
      uf: z.string().nullable(),
      neighborhood: z.string(),
      city: z.string(),
      zipCode: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
      usersId: z.string().nullable(),
      elevator: z.boolean().nullable(),
    })
    .nullable(),
})
