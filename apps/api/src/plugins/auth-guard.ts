import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { z } from "zod";
import { usersRepository } from "../modules/users/users.repository.js";
import type { UserRole } from "../shared/types/index.js";
import { sendError } from "../shared/utils/index.js";

const jwtPayloadSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  role: z.enum(["admin", "user"]),
  type: z.enum(["access", "refresh"]),
});

/**
 * Guard para garantir que todas as rotas estejam protegidas e
 * possam apenas ser acessadas por um usuário logado
 */
export const authGuardPlugin = fp(async (fastify) => {
  fastify.decorateRequest("currentUser", null);

  fastify.decorate(
    "authenticate",
    async function authenticate(request: FastifyRequest, reply: FastifyReply) {
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
    },
  );

  fastify.decorate("authorize", function authorize(allowedRoles: UserRole[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      await fastify.authenticate(request, reply);

      if (reply.sent) return;

      if (
        !request.currentUser ||
        !allowedRoles.includes(request.currentUser.role)
      ) {
        return sendError(reply, {
          statusCode: 403,
          error: "Sem permissao para esta acao",
          code: "FORBIDDEN",
        });
      }
    };
  });
});
