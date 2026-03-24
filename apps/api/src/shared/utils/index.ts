import type { FastifyReply } from "fastify";

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function sendError(
  reply: FastifyReply,
  input: { statusCode: number; error: string; code: string },
) {
  return reply.code(input.statusCode).send({
    error: input.error,
    code: input.code,
    statusCode: input.statusCode,
  });
}
