import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { sendError } from "../../shared/utils/index.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema.js";
import { authService } from "./auth.service.js";

export async function authRoute(app: FastifyInstance) {
  const auth = app.withTypeProvider<ZodTypeProvider>();

  auth.post("/auth/register", {
    schema: {
      tags: ["Auth"],
      summary: "Criar nova conta",
      body: registerSchema,
      security: [],
    },
    handler: async (request, reply) => {
      const result = await authService.register(request.body);
      if (result.conflict) {
        return sendError(reply, {
          statusCode: 409,
          error: "E-mail ja cadastrado",
          code: "EMAIL_CONFLICT",
        });
      }

      return reply.code(201).send(result.user);
    },
  });

  auth.post("/auth/login", {
    schema: {
      tags: ["Auth"],
      summary: "Autenticar e obter JWT",
      body: loginSchema,
      security: [],
    },
    handler: async (request, reply) => {
      const tokens = await authService.login(request.body);

      if (!tokens) {
        return sendError(reply, {
          statusCode: 401,
          error: "Credenciais invalidas",
          code: "UNAUTHORIZED",
        });
      }

      return reply.send(tokens);
    },
  });

  auth.post("/auth/refresh", {
    schema: {
      tags: ["Auth"],
      summary: "Renovar token JWT",
      body: refreshSchema,
      security: [],
    },
    handler: async (request, reply) => {
      const refreshed = await authService.refresh(request.body.refreshToken);
      if (!refreshed) {
        return sendError(reply, {
          statusCode: 401,
          error: "Token invalido ou ausente",
          code: "UNAUTHORIZED",
        });
      }

      return reply.send(refreshed);
    },
  });
}
