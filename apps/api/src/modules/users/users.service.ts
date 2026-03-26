import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { usersTable } from "../../db/schema.js";
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

export const findUserById = async (
  userId: string,
): Promise<PublicUser | null> => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });
  return user ? toPublicUser(user) : null;
};

const updateUser = async (
  userId: string,
  input: { name?: string; password?: string },
): Promise<PublicUser | null> => {
  await db
    .update(usersTable)
    .set({ name: input.name, password: input.password })
    .where(eq(usersTable.id, userId));
  return findUserById(userId);
};

const deleteUserById = async (userId: string): Promise<boolean> => {
  const deleted = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });
  return deleted.length > 0;
};

export const usersService = {
  getMe: findUserById,
  updateMe: updateUser,
  deleteMe: deleteUserById,
};
