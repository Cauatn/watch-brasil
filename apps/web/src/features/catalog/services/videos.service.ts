import { api } from "@/shared/api/http";
import type { VideoListResponse } from "../types/video";

export type ListVideosParams = {
  page?: number;
  limit?: number;
  status?: "processing" | "ready" | "error";
  uploadedBy?: string;
};

export const videosService = {
  async list(params: ListVideosParams = {}) {
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
  },
};
