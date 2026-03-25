import "fastify";
import type { PublicUser, UserRole } from "../shared/types/index.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser: PublicUser | null;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
    authorize: (
      allowedRoles: UserRole[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<unknown>;
  }
}
