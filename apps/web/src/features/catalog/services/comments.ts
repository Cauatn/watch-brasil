import type { PublicUser } from "@/features/auth/types/auth";
import { api } from "@/lib/api";

export type VideoComment = {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author: PublicUser | null;
};

export type ListCommentsResponse = {
  type: "ok";
  data: VideoComment[];
  total: number;
  page: number;
  limit: number;
};

export async function listVideoComments(
  videoId: string,
  params: { page?: number; limit?: number } = {},
) {
  const { data } = await api.get<ListCommentsResponse>(
    `/videos/${videoId}/comments`,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
      },
    },
  );
  return data;
}

export async function postVideoComment(videoId: string, content: string) {
  const { data } = await api.post<VideoComment>(
    `/videos/${videoId}/comments`,
    { content },
  );
  return data;
}

export async function deleteVideoComment(videoId: string, commentId: string) {
  await api.delete(`/videos/${videoId}/comments/${commentId}`);
}
