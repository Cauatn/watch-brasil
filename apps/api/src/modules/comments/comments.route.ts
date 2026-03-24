import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { requireAuth } from "../../plugins/auth.js";
import { sendError } from "../../shared/utils/index.js";
import {
  commentParamsSchema,
  commentsQuerySchema,
  createCommentSchema,
  videoParamsSchema,
} from "./comments.schema.js";
import { commentsService } from "./comments.service.js";

export async function commentsRoute(app: FastifyInstance) {
  const comments = app.withTypeProvider<ZodTypeProvider>();

  comments.get("/videos/:id/comments", {
    schema: {
      tags: ["Comments"],
      summary: "Listar comentarios de um video",
      params: videoParamsSchema,
      querystring: commentsQuerySchema,
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;

      const result = await commentsService.list({
        videoId: request.params.id,
        ...request.query,
      });

      if (result.type === "video_not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Recurso nao encontrado",
          code: "NOT_FOUND",
        });
      }

      return reply.send(result);
    },
  });

  comments.post("/videos/:id/comments", {
    schema: {
      tags: ["Comments"],
      summary: "Postar um comentario",
      params: videoParamsSchema,
      body: createCommentSchema,
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;

      const result = await commentsService.create({
        videoId: request.params.id,
        actorId: user.id,
        content: request.body.content,
      });

      if (result.type === "video_not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Recurso nao encontrado",
          code: "NOT_FOUND",
        });
      }

      return reply.code(201).send(result.comment);
    },
  });

  comments.delete("/videos/:id/comments/:commentId", {
    schema: {
      tags: ["Comments"],
      summary: "Remover comentario",
      params: commentParamsSchema,
    },
    handler: async (request, reply) => {
      const user = await requireAuth(request, reply);
      if (!user) return;

      const result = await commentsService.delete({
        videoId: request.params.id,
        commentId: request.params.commentId,
        actorId: user.id,
      });

      if (result.type === "video_not_found" || result.type === "not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Recurso nao encontrado",
          code: "NOT_FOUND",
        });
      }
      if (result.type === "forbidden") {
        return sendError(reply, {
          statusCode: 403,
          error: "Sem permissao para esta acao",
          code: "FORBIDDEN",
        });
      }

      return reply.code(204).send();
    },
  });
}
