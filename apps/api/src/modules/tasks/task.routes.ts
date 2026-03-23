import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from './task.repository.js'
import {
  createTaskInputSchema,
  taskIdParamsSchema,
  updateTaskInputSchema,
} from './task.schemas.js'

export async function taskRoutes(app: FastifyInstance) {
  app.get('/tasks', {
    schema: {
      tags: ['tasks'],
      summary: 'List tasks',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              done: { type: 'boolean' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    },
    handler: async () => listTasks(),
  })

  app.post('/tasks', {
    schema: {
      tags: ['tasks'],
      summary: 'Create task',
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
        },
      },
    },
    handler: async (request, reply) => {
      const parsedBody = createTaskInputSchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.code(400).send({
          message: 'Invalid task payload',
          errors: z.treeifyError(parsedBody.error),
        })
      }

      const task = createTask(parsedBody.data)
      return reply.code(201).send(task)
    },
  })

  app.get('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      summary: 'Get task by id',
    },
    handler: async (request, reply) => {
      const parsedParams = taskIdParamsSchema.safeParse(request.params)
      if (!parsedParams.success) {
        return reply.code(400).send({
          message: 'Invalid task id',
          errors: z.treeifyError(parsedParams.error),
        })
      }

      const task = getTaskById(parsedParams.data.id)
      if (!task) {
        return reply.code(404).send({ message: 'Task not found' })
      }
      return task
    },
  })

  app.patch('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      summary: 'Update task',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          done: { type: 'boolean' },
        },
      },
    },
    handler: async (request, reply) => {
      const parsedParams = taskIdParamsSchema.safeParse(request.params)
      if (!parsedParams.success) {
        return reply.code(400).send({
          message: 'Invalid task id',
          errors: z.treeifyError(parsedParams.error),
        })
      }

      const parsedBody = updateTaskInputSchema.safeParse(request.body)
      if (!parsedBody.success) {
        return reply.code(400).send({
          message: 'Invalid task payload',
          errors: z.treeifyError(parsedBody.error),
        })
      }

      const task = updateTask(parsedParams.data.id, parsedBody.data)
      if (!task) {
        return reply.code(404).send({ message: 'Task not found' })
      }
      return task
    },
  })

  app.delete('/tasks/:id', {
    schema: {
      tags: ['tasks'],
      summary: 'Delete task',
    },
    handler: async (request, reply) => {
      const parsedParams = taskIdParamsSchema.safeParse(request.params)
      if (!parsedParams.success) {
        return reply.code(400).send({
          message: 'Invalid task id',
          errors: z.treeifyError(parsedParams.error),
        })
      }

      const removed = deleteTask(parsedParams.data.id)
      if (!removed) {
        return reply.code(404).send({ message: 'Task not found' })
      }
      return reply.code(204).send()
    },
  })
}
