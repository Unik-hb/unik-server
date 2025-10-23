import { z } from 'zod'

export const userSchemaRequest = z.object({
  name: z.string(),
  company: z.string().optional(),
  email: z.email(),
  phone: z.string().optional(),
  cpf: z
    .string()
    .min(11, { message: 'CPF inválido' })
    .max(11, { message: 'CPF inválido' })
    .optional(),
  cnpj: z
    .string()
    .min(14, { message: 'CNPJ inválido' })
    .max(14, { message: 'CNPJ inválido' })
    .optional(),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  photo: z.string().optional(),
})

export const userIdSchemaRequest = z.object({
  usersId: z.string(),
})

export const userBrokerSchemaResponse = z.object({
  brokers: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      email: z.string(),
      photo: z.string().nullable(),
      phone: z.string().nullable(),
      properties: z
        .object({
          id: z.string(),
          photos: z.preprocess(
            value => (typeof value === 'string' ? JSON.parse(value) : value),
            z.array(z.string()).nullable()
          ),
          category: z.string(),
          title: z.string(),
          city: z.string(),
          neighborhood: z.string(),
          builtArea: z.number(),
          bedrooms: z.number(),
          bathroon: z.number().nullable(),
          price: z.number(),
          User: z
            .object({
              photo: z.string().nullable(),
            })
            .nullable(),
        })
        .array(),
    })
    .array(),
})

export const getDetailsBrokerSchemaResponse = z.object({
  broker: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      email: z.string(),
      photo: z.string().nullable(),
      phone: z.string().nullable(),
      properties: z
        .object({
          id: z.string(),
          photos: z.preprocess(
            value => (typeof value === 'string' ? JSON.parse(value) : value),
            z.array(z.string()).nullable()
          ),
          category: z.string(),
          title: z.string(),
          city: z.string(),
          neighborhood: z.string(),
          builtArea: z.number(),
          bedrooms: z.number(),
          bathroon: z.number().nullable(),
          price: z.number(),
          status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REVISION']),
        })
        .array(),
    })
    .nullable(),
})

export const userEmailSchemaRequest = z.object({
  email: z.string(),
})
