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
      const authenticatedUser = await authService.login(request.body);

      if (!authenticatedUser) {
        return sendError(reply, {
          statusCode: 401,
          error: "Credenciais invalidas",
          code: "UNAUTHORIZED",
        });
      }

      const accessToken = await reply.jwtSign(
        {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          type: "access",
        },
        { expiresIn: "15m" },
      );

      const refreshToken = await reply.jwtSign(
        {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          type: "refresh",
        },
        { expiresIn: "7d" },
      );

      return reply.send({
        accessToken,
        refreshToken,
        expiresIn: 60 * 15,
      });
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
      try {
        const payload = await app.jwt.verify<{
          id: string;
          email: string;
          type: "access" | "refresh";
        }>(request.body.refreshToken);

        if (payload.type !== "refresh") {
          return sendError(reply, {
            statusCode: 401,
            error: "Token invalido ou ausente",
            code: "UNAUTHORIZED",
          });
        }

        const accessToken = await reply.jwtSign(
          { id: payload.id, email: payload.email, type: "access" },
          { expiresIn: "15m" },
        );

        return reply.send({
          accessToken,
          expiresIn: 60 * 15,
        });
      } catch {
        return sendError(reply, {
          statusCode: 401,
          error: "Token invalido ou ausente",
          code: "UNAUTHORIZED",
        });
      }
    },
  });
}
