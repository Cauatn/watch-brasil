import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { taskRoutes } from './modules/tasks/task.routes.js'
import { helloRoutes } from './routes/hello.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.register(cors, {
    origin: true,
  })

  app.register(swagger, {
    openapi: {
      info: {
        title: 'Watch Brasil API',
        version: '1.0.0',
      },
    },
  })

  app.register(swaggerUi, {
    routePrefix: '/docs',
  })

  app.register(async (api) => {
    api.get('/health', async () => ({ status: 'ok' }))
    await helloRoutes(api)
    await taskRoutes(api)
  }, { prefix: '/api' })

  return app
}
