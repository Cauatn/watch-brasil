export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
