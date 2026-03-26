import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { sendError } from "../../shared/utils/index.js";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskParamsSchema,
  updateTaskSchema,
} from "./tasks.schema.js";
import { tasksService } from "./tasks.service.js";

export async function tasksRoute(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get("/tasks", {
    schema: {
      tags: ["Tasks"],
      summary: "Listar minhas tarefas (inclui Ver filme ligado ao catalogo)",
      querystring: listTasksQuerySchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const list = await tasksService.list({
        userId: request.currentUser!.id,
        ...request.query,
      });
      return reply.send({ data: list });
    },
  });

  r.post("/tasks", {
    schema: {
      tags: ["Tasks"],
      summary: "Criar tarefa (categoria watch_movie para meta de assistir)",
      body: createTaskSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const body = request.body;
      const result = await tasksService.create({
        userId: request.currentUser!.id,
        title: body.title,
        description: body.description,
        status: body.status,
        category: body.category,
        videoId: body.videoId ?? null,
      });

      if (result.type === "video_not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Video nao encontrado",
          code: "NOT_FOUND",
        });
      }
      if (result.type === "error") {
        return sendError(reply, {
          statusCode: 500,
          error: "Erro ao criar tarefa",
          code: "INTERNAL",
        });
      }

      return reply.code(201).send(result.task);
    },
  });

  r.get("/tasks/:id", {
    schema: {
      tags: ["Tasks"],
      summary: "Detalhe de uma tarefa minha",
      params: taskParamsSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const task = await tasksService.getById(
        request.params.id,
        request.currentUser!.id,
      );
      if (!task) {
        return sendError(reply, {
          statusCode: 404,
          error: "Tarefa nao encontrada",
          code: "NOT_FOUND",
        });
      }
      return reply.send(task);
    },
  });

  r.patch("/tasks/:id", {
    schema: {
      tags: ["Tasks"],
      summary: "Atualizar tarefa",
      params: taskParamsSchema,
      body: updateTaskSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const result = await tasksService.update({
        taskId: request.params.id,
        userId: request.currentUser!.id,
        ...request.body,
      });

      if (result.type === "not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Tarefa nao encontrada",
          code: "NOT_FOUND",
        });
      }
      if (result.type === "video_not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Video nao encontrado",
          code: "NOT_FOUND",
        });
      }

      return reply.send(result.task);
    },
  });

  r.delete("/tasks/:id", {
    schema: {
      tags: ["Tasks"],
      summary: "Remover tarefa",
      params: taskParamsSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const result = await tasksService.delete(
        request.params.id,
        request.currentUser!.id,
      );
      if (result.type === "not_found") {
        return sendError(reply, {
          statusCode: 404,
          error: "Tarefa nao encontrada",
          code: "NOT_FOUND",
        });
      }
      return reply.code(204).send();
    },
  });
}
