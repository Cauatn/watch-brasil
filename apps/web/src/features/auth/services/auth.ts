import { api } from "@/lib/api";
import type {
  AuthTokens,
  LoginPayload,
  PublicUser,
  SignupPayload,
} from "../types/auth";

export const login = async (body: LoginPayload): Promise<AuthTokens> => {
  const { data } = await api.post<AuthTokens>("/auth/login", body);
  return data;
};

export const fetchMe = async (): Promise<PublicUser> => {
  const { data } = await api.get<PublicUser>("/users/me");
  return data;
};

export const register = async (payload: SignupPayload): Promise<PublicUser> => {
  const { data } = await api.post<PublicUser>("/auth/register", payload);
  return data;
};
