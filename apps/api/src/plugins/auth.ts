import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { authService } from "../modules/auth/auth.service.js";
import { sendError } from "../shared/utils/index.js";

const authHeaderSchema = z.string().regex(/^Bearer\s+.+$/i);

export function parseBearerToken(authorization: string | undefined) {
  const parsed = authHeaderSchema.safeParse(authorization);
  if (!parsed.success) return null;
  return parsed.data.replace(/^Bearer\s+/i, "").trim();
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = parseBearerToken(request.headers.authorization);
  if (!token) {
    sendError(reply, {
      statusCode: 401,
      error: "Token invalido ou ausente",
      code: "UNAUTHORIZED",
    });
    return null;
  }

  const user = await authService.getAuthenticatedUser(token);
  if (!user) {
    sendError(reply, {
      statusCode: 401,
      error: "Token invalido ou ausente",
      code: "UNAUTHORIZED",
    });
    return null;
  }

  return user;
}
