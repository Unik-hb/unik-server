import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z, { ZodError } from "zod";
import { listOfPropertiesSoldRentedRejected } from "../functions/list-of-properties-sold-rented-rejected.ts";

export const listOfPropertiesSoldRentedRejectedRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/properties/sold-rented-rejected', {
    schema: {
      tags: ['Properties'],
      summary: 'List of properties sold, rented or rejected',
      description: 'List of properties that have been sold, rented or rejected. Pagination of 10 items per page.',
      querystring: z.object({
        pageIndex: z.coerce.number().min(0).default(0)
      }),
      response: {
        200: z.object({
          properties: z.array(z.object({
            id: z.string(),
            title: z.string(),
            category: z.string(),
            status: z.string(),
            User: z.object({
              name: z.string(),
            }).nullable()
          })),
          metas: z.object({
            totalPages: z.number(),
            totalProperties: z.number(),
          })
        }),
        400: z.object({
          message: z.string(),
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { pageIndex } = request.query

      const { properties, metas } = await listOfPropertiesSoldRentedRejected(
        { pageIndex }
      )

      return reply.status(200).send({
        properties,
        metas
      })

    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: error.message
        })
      }
    }
  })
}