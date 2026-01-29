import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { editReceivedPropety } from "../functions/edit-received-property.ts";

export const editReceivedPropertyRoutes: FastifyPluginCallbackZod = (app) => {
  app.put(
    "/properties/edit-received-property/:propertyId",
    {
      schema: {
        tags: ["Properties"],
        params: z.object({
          propertyId: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          price: z.number().optional(),
          condoFee: z.number().optional(),
          iptu: z.number().optional(),
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
    },
    async (request, reply) => {
      try {
        const { propertyId } = request.params;
        const { title, description, price, condoFee, iptu } = request.body;

        const { message } = await editReceivedPropety({
          propertyId,
          title,
          description,
          price,
          condoFee,
          iptu,
        });

        return reply.status(200).send({ message });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: error.message,
          });
        }
      }
    },
  );
};
