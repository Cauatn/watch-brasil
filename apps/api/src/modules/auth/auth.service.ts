import { randomUUID } from 'node:crypto'
import { authRepository } from './auth.repository.js'

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    return authRepository.createUser({
      id: randomUUID(),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      password: input.password,
    })
  },

  async login(input: { email: string; password: string }) {
    const user = await authRepository.findUserByEmail(input.email.trim().toLowerCase())
    if (!user || user.password !== input.password) {
      return null
    }

    const accessToken = randomUUID()
    const refreshToken = randomUUID()

    await authRepository.createSession({
      id: randomUUID(),
      userId: user.id,
      accessToken,
      refreshToken,
    })

    return { accessToken, refreshToken, expiresIn: 60 * 60 * 24 }
  },

  async refresh(refreshToken: string) {
    const nextAccessToken = randomUUID()
    const accessToken = await authRepository.refreshAccessToken(refreshToken, nextAccessToken)
    if (!accessToken) return null
    return { accessToken, expiresIn: 60 * 60 * 24 }
  },

  async getAuthenticatedUser(accessToken: string) {
    const user = await authRepository.findUserByAccessToken(accessToken)
    if (!user) return null
    const { password: _password, ...publicUser } = user
    return { ...publicUser, createdAt: publicUser.createdAt.toISOString() }
  },
}
