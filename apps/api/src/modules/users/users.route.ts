import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateUserSchema } from "./users.schema.js";
import { usersService } from "./users.service.js";

export async function usersRoute(app: FastifyInstance) {
  const users = app.withTypeProvider<ZodTypeProvider>();

  users.get("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Retornar perfil do usuario autenticado",
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      return reply.send(request.currentUser);
    },
  });

  users.put("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Atualizar nome ou senha",
      body: updateUserSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const updated = await usersService.updateMe(
        request.currentUser!.id,
        request.body,
      );
      return reply.send(updated);
    },
  });

  users.delete("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Remover conta do usuario autenticado",
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      await usersService.deleteMe(request.currentUser!.id);
      return reply.code(204).send();
    },
  });
}
