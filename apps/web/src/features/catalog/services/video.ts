import { api } from "@/lib/api";
import type {
  CatalogVideoDetail,
  CreateVideoPayload,
  ListVideosParams,
  UpdateVideoPayload,
  VideoListResponse,
} from "@/features/catalog/types/video";

export type {
  CatalogVideo,
  CatalogVideoDetail,
  CreateVideoPayload,
  ListVideosParams,
  UpdateVideoPayload,
  VideoListResponse,
  VideoStatus,
} from "@/features/catalog/types/video";

export async function listVideos(params: ListVideosParams = {}) {
  const { data } = await api.get<VideoListResponse>("/videos", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 60,
      status: params.status,
      uploadedBy: params.uploadedBy,
      search: params.search?.trim() || undefined,
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
