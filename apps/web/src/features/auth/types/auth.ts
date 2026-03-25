export type UserRole = "admin" | "user";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
