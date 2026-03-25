import { randomUUID } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { authRepository } from "./auth.repository.js";

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const passwordHash = await hash(input.password, 10);
    return authRepository.createUser({
      id: randomUUID(),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      password: passwordHash,
    });
  },

  async login(input: { email: string; password: string }) {
    const user = await authRepository.findUserByEmail(
      input.email.trim().toLowerCase(),
    );
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
