import { eq } from 'drizzle-orm'
import { db } from '../../shared/db/client.js'
import { sessionsTable, usersTable } from '../../shared/db/schema.js'
import type { PublicUser } from '../../shared/types/index.js'

function toPublicUser(user: typeof usersTable.$inferSelect): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

export const authRepository = {
  async createUser(input: { id: string; name: string; email: string; password: string }) {
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, input.email),
    })
    if (existing) {
      return { conflict: true as const }
    }

    const now = new Date()
    await db.insert(usersTable).values({
      id: input.id,
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: now,
    })

    return {
      conflict: false as const,
      user: {
        id: input.id,
        name: input.name,
        email: input.email,
        createdAt: now.toISOString(),
      } satisfies PublicUser,
    }
  },

  async findUserByEmail(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return user ?? null
  },

  async createSession(input: { id: string; userId: string; accessToken: string; refreshToken: string }) {
    await db.insert(sessionsTable).values({
      id: input.id,
      userId: input.userId,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      createdAt: new Date(),
    })
  },

  async findUserByAccessToken(accessToken: string) {
    const session = await db.query.sessionsTable.findFirst({
      where: eq(sessionsTable.accessToken, accessToken),
    })
    if (!session) return null
    return db.query.usersTable.findFirst({
      where: eq(usersTable.id, session.userId),
    })
  },

  async refreshAccessToken(refreshToken: string, nextAccessToken: string) {
    const updated = await db
      .update(sessionsTable)
      .set({ accessToken: nextAccessToken })
      .where(eq(sessionsTable.refreshToken, refreshToken))
      .returning({ accessToken: sessionsTable.accessToken })
    return updated[0]?.accessToken ?? null
  },
}
