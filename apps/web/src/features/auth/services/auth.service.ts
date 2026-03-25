import { api } from "@/lib/api";
import type { AuthTokens, LoginPayload, PublicUser, SignupPayload } from "../types/auth";

export const authService = {
  async login(body: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>("/auth/login", body);
    return data;
  },

  async fetchMe(): Promise<PublicUser> {
    const { data } = await api.get<PublicUser>("/users/me");
    return data;
  },

  async register(payload: SignupPayload): Promise<PublicUser> {
    const { data } = await api.post<PublicUser>("/auth/register", payload);
    return data;
  },
};
