import type { PublicUser } from "@/features/auth/types/auth";
import { api } from "@/lib/api";

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
};

export async function listVideos(params: ListVideosParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 60;
  const { data } = await api.get<VideoListResponse>("/videos", {
    params: {
      page,
      limit,
      ...(params.status ? { status: params.status } : {}),
      ...(params.uploadedBy ? { uploadedBy: params.uploadedBy } : {}),
    },
  });
  return data;
}

export async function createVideo(body: CreateVideoPayload) {
  const { data } = await api.post<CatalogVideoDetail>("/videos", body);
  return data;
}

export async function getVideo(id: string) {
  const { data } = await api.get<CatalogVideoDetail>(`/videos/${id}`);
  return data;
}

export async function updateVideo(id: string, body: UpdateVideoPayload) {
  const { data } = await api.put<CatalogVideoDetail>(`/videos/${id}`, body);
  return data;
}

export async function deleteVideo(id: string) {
  await api.delete(`/videos/${id}`);
}
