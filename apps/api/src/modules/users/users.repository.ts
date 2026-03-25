import { eq } from "drizzle-orm";
import { db } from "../../shared/db/client.js";
import { usersTable } from "../../shared/db/schema.js";
import type { PublicUser, UserRole } from "../../shared/types/index.js";

function toPublicUser(user: typeof usersTable.$inferSelect): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    createdAt: user.createdAt.toISOString(),
  };
}

export const usersRepository = {
  async findById(userId: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });
    return user ? toPublicUser(user) : null;
  },

  async update(userId: string, input: { name?: string; password?: string }) {
    await db
      .update(usersTable)
      .set({ name: input.name, password: input.password })
      .where(eq(usersTable.id, userId));
    return this.findById(userId);
  },

  async delete(userId: string) {
    const deleted = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning({ id: usersTable.id });
    return deleted.length > 0;
  },
};
