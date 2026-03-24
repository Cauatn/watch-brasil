import { api } from "@/lib/api";
import type { AuthTokens, LoginPayload, PublicUser } from "../types/auth";

export const authService = {
  async login(body: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>("/auth/login", body);
    return data;
  },

  async fetchMe(): Promise<PublicUser> {
    const { data } = await api.get<PublicUser>("/users/me");
    return data;
  },
};
