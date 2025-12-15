import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z, { ZodError } from "zod";
import { markAsSoldOrRented } from "../functions/mark-as-sold-or-rented.ts";

export const markAsSoldOrRentedRoutes: FastifyPluginCallbackZod = (app) => {
  app.patch('/properties/mark-as-sold-or-rented/:propertyId', {
    schema: {
      tags: ['Properties'],
      description: 'Mark a property as sold or rented',
      params: z.object({
        propertyId: z.uuid(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },
  }, async (request, reply) => {
    try {

      const { propertyId } = request.params;

      const { message } = await markAsSoldOrRented({ propertyId });

      return reply.status(200).send({
        message
      });

    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: error.message
        })
      }
    }
  });
}