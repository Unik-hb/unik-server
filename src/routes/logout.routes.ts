import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

export const logoutRoutes: FastifyPluginCallbackZod = (app) => {
  app.get('/logout', {
    schema: {
      tags: ['Authenticate'],
      description: 'Logout the current user by clearing the authentication cookie.',
    }
  }, async (request, reply) => {
    reply.clearCookie('token', {
      path: '/',
      secure: true,
      sameSite: 'none',
    })
  }
  )
}