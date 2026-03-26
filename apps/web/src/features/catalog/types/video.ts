import type { PublicUser } from "@/features/auth/types/auth";

export type VideoStatus = "processing" | "ready" | "error";

export type CatalogVideo = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  coverUrl: string;
  mimeType: string;
  sizeBytes: number;
  status: VideoStatus;
  uploadedById: string;
  createdAt: string;
};

export type VideoListResponse = {
  data: CatalogVideo[];
  total: number;
  page: number;
  limit: number;
};

export type CreateVideoPayload = {
  title: string;
  url: string;
  coverUrl: string;
  description?: string;
};

export type UpdateVideoPayload = {
  title: string;
  url?: string;
  coverUrl?: string;
  description?: string;
};

export type CatalogVideoDetail = CatalogVideo & {
  uploadedBy: PublicUser | null;
};

export type ListVideosParams = {
  page?: number;
  limit?: number;
  status?: VideoStatus;
  uploadedBy?: string;
  /** Busca por trecho do título (case-insensitive, API). */
  search?: string;
};
