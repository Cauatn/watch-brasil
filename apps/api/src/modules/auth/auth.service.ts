import { randomUUID } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { usersTable } from "../../db/schema.js";
import type { PublicUser } from "../../shared/types/index.js";

const createUser = async (input: {
  id: string;
  name: string;
  email: string;
  password: string;
}) => {
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
};

const findUserByEmail = async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
  return user ?? null;
};

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const passwordHash = await hash(input.password, 10);
    return createUser({
      id: randomUUID(),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      password: passwordHash,
    });
  },

  async login(input: { email: string; password: string }) {
    const user = await findUserByEmail(input.email.trim().toLowerCase());
    if (!user) {
      return null;
    }

    const isValidPassword = await compare(input.password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  },
};
