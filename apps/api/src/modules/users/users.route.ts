import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { requireAuth } from "../../plugins/auth.js";
import { updateUserSchema } from "./users.schema.js";
import { usersService } from "./users.service.js";

export async function usersRoute(app: FastifyInstance) {
  const users = app.withTypeProvider<ZodTypeProvider>();

  users.get("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Retornar perfil do usuario autenticado",
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;
      return reply.send(user);
    },
  });

  users.put("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Atualizar nome ou senha",
      body: updateUserSchema,
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;

      const updated = await usersService.updateMe(user.id, request.body);
      return reply.send(updated);
    },
  });

  users.delete("/users/me", {
    schema: {
      tags: ["Users"],
      summary: "Remover conta do usuario autenticado",
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;
      await usersService.deleteMe(user.id);
      return reply.code(204).send();
    },
  });
}
