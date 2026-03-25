import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { usersTable } from "../../db/schema.js";
import type { PublicUser } from "../../shared/types/index.js";

export const authRepository = {
  async createUser(input: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, input.email),
    });

    if (existing) {
      return { conflict: true as const };
    }

    const now = new Date();

    await db.insert(usersTable).values({
      id: input.id,
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: now,
    });

    return {
      conflict: false as const,
      user: {
        id: input.id,
        name: input.name,
        email: input.email,
        role: "user",
        createdAt: now.toISOString(),
      } satisfies PublicUser,
    };
  },

  async findUserByEmail(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    return user ?? null;
  },
};
