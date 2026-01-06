import path, { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fastifyCookie from '@fastify/cookie'
import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env/env.ts'
import { routes } from './routes/index.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
})

const uploadsPath = join(__dirname, '..', 'uploads')

app.register(fastifyMultipart, {
  prefix: 'files',
  attachFieldsToBody: true,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 15,
  },
})

app.register(fastifyStatic, {
  root: uploadsPath,
  prefix: '/files/',
  decorateReply: true,
})

app.register(fastifyJwt, {
  secret: env.PRIVATE_KEY_JWT,
  sign: {
    expiresIn: '7d',
  },
  cookie: {
    cookieName: 'token',
    signed: false,
  },
})

app.register(fastifyCookie)

if (env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Unik API',
        version: '1.0.0',
      },
    },

    transform: jsonSchemaTransform,
  })

  app.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'elysiajs',
    },
  })
}



app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(routes)
