import type { FastifyReply, FastifyRequest } from "fastify";
import { usersRepository } from "../modules/users/users.repository.js";
import { sendError } from "../shared/utils/index.js";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const payload = await request.jwtVerify<{
      id: string;
      email: string;
      type: "access" | "refresh";
    }>();

    if (payload.type !== "access") {
      sendError(reply, {
        statusCode: 401,
        error: "Token invalido ou ausente",
        code: "UNAUTHORIZED",
      });
      return null;
    }

    const user = await usersRepository.findById(payload.id);
    if (!user) {
      sendError(reply, {
        statusCode: 401,
        error: "Token invalido ou ausente",
        code: "UNAUTHORIZED",
      });
      return null;
    }

    return user;
  } catch {
    sendError(reply, {
      statusCode: 401,
      error: "Token invalido ou ausente",
      code: "UNAUTHORIZED",
    });
    return null;
  }
}
