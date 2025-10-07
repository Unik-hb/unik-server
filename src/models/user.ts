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
