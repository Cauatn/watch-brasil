export type Nullable<T> = T | null;

export type UserRole = "admin" | "user";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type VideoStatus = "processing" | "ready" | "error";
