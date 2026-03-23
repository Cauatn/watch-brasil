import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const helloResponseSchema = z.object({
  message: z.string(),
})

export async function helloRoutes(app: FastifyInstance) {
  app.get('/hello', {
    schema: {
      tags: ['health'],
      summary: 'Simple hello endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: async () => {
      return helloResponseSchema.parse({ message: 'Hello World from Fastify' })
    },
  })
}
