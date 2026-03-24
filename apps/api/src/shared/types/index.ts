export type Nullable<T> = T | null;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type VideoStatus = "processing" | "ready" | "error";
