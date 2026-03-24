import fp from "fastify-plugin";
import { z } from "zod";
import { usersRepository } from "../modules/users/users.repository.js";
import { sendError } from "../shared/utils/index.js";

const jwtPayloadSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  type: z.enum(["access", "refresh"]),
});

/**
 * Guard para garantir que todas as rotas estejam protegidas e
 * possam apenas ser acessadas por um usuário logado
 */
export const authGuardPlugin = fp(async (fastify) => {
  fastify.decorateRequest("currentUser", null);

  fastify.decorate("authenticate", async function authenticate(request, reply) {
    try {
      const verifiedPayload = await request.jwtVerify();
      const parsedPayload = jwtPayloadSchema.safeParse(verifiedPayload);

      if (!parsedPayload.success) {
        return sendError(reply, {
          statusCode: 401,
          error: "Token invalido ou ausente",
          code: "UNAUTHORIZED",
        });
      }

      const payload = parsedPayload.data;

      if (payload.type !== "access") {
        return sendError(reply, {
          statusCode: 401,
          error: "Token invalido ou ausente",
          code: "UNAUTHORIZED",
        });
      }

      const user = await usersRepository.findById(payload.id);

      if (!user) {
        return sendError(reply, {
          statusCode: 401,
          error: "Token invalido ou ausente",
          code: "UNAUTHORIZED",
        });
      }

      request.currentUser = user;
    } catch {
      return sendError(reply, {
        statusCode: 401,
        error: "Token invalido ou ausente",
        code: "UNAUTHORIZED",
      });
    }
  });
});
