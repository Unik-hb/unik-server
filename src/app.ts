import fastify from 'fastify'

import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'

import { env } from './env/env'

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import scalarAPIReference from '@scalar/fastify-api-reference'
import { routes } from './routes'
import fastifyMultipart from '@fastify/multipart'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
    files: 6,
  },
})

if (env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Unik API',
        description: 'Unik API documentation',
        version: '1.0.0',
      },
    },

    transform: jsonSchemaTransform,
  })

  app.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'deepSpace',
    },
  })
}

app.register(routes)
