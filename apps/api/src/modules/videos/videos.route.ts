import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { sendError } from '../../shared/utils/index.js'
import { createVideoSchema, listVideosQuerySchema, updateVideoSchema, videoParamsSchema } from './videos.schema.js'
import { videosService } from './videos.service.js'

export async function videosRoute(app: FastifyInstance) {
  const videos = app.withTypeProvider<ZodTypeProvider>()

  videos.get('/videos', {
    schema: { tags: ['Videos'], summary: 'Listar videos disponiveis', querystring: listVideosQuerySchema },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      return reply.send(await videosService.list(request.query))
    },
  })

  videos.post('/videos', {
    schema: { tags: ['Videos'], summary: 'Fazer upload de um video', body: createVideoSchema },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const video = await videosService.create({ actorId: request.currentUser!.id, ...request.body })
      return reply.code(201).send(video)
    },
  })

  videos.get('/videos/:id', {
    schema: { tags: ['Videos'], summary: 'Buscar detalhes de um video', params: videoParamsSchema },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const video = await videosService.getById(request.params.id)
      if (!video) {
        return sendError(reply, { statusCode: 404, error: 'Recurso nao encontrado', code: 'NOT_FOUND' })
      }

      return reply.send(video)
    },
  })

  videos.put('/videos/:id', {
    schema: {
      tags: ['Videos'],
      summary: 'Atualizar titulo ou descricao do video',
      params: videoParamsSchema,
      body: updateVideoSchema,
    },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const result = await videosService.update({
        videoId: request.params.id,
        actorId: request.currentUser!.id,
        ...request.body,
      })

      if (result.type === 'not_found') {
        return sendError(reply, { statusCode: 404, error: 'Recurso nao encontrado', code: 'NOT_FOUND' })
      }
      if (result.type === 'forbidden') {
        return sendError(reply, { statusCode: 403, error: 'Sem permissao para esta acao', code: 'FORBIDDEN' })
      }

      return reply.send(result.video)
    },
  })

  videos.delete('/videos/:id', {
    schema: { tags: ['Videos'], summary: 'Remover video e arquivo do disco', params: videoParamsSchema },
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const result = await videosService.delete({
        videoId: request.params.id,
        actorId: request.currentUser!.id,
      })

      if (result.type === 'not_found') {
        return sendError(reply, { statusCode: 404, error: 'Recurso nao encontrado', code: 'NOT_FOUND' })
      }
      if (result.type === 'forbidden') {
        return sendError(reply, { statusCode: 403, error: 'Sem permissao para esta acao', code: 'FORBIDDEN' })
      }

      return reply.code(204).send()
    },
  })
}
