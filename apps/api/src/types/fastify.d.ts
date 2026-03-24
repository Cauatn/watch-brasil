import "fastify";
import type { PublicUser } from "../shared/types/index.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser: PublicUser | null;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
  }
}
