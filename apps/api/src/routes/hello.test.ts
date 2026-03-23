import { buildApp } from '../app.js'

describe('hello route', () => {
  it('returns hello world payload', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'GET',
      url: '/api/hello',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      message: 'Hello World from Fastify',
    })
  })
})
