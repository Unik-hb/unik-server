import 'dotenv/config'

import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  PRIVATE_KEY_JWT: z.string(),
  PUBLIC_KEY_JWT: z.string(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  PUBLIC_KEY_JWT: process.env.PUBLIC_KEY_JWT,
})
