import { randomUUID } from "node:crypto";
import type { VideoStatus } from "../../shared/types/index.js";
import { usersRepository } from "../users/users.repository.js";
import { videosRepository } from "./videos.repository.js";

export const videosService = {
  async list(input: {
    page: number;
    limit: number;
    status?: VideoStatus;
    uploadedBy?: string;
    search?: string;
  }) {
    return videosRepository.listVideos(input);
  },

  async create(input: {
    actorId: string;
    title: string;
    url: string;
    coverUrl: string;
    description?: string;
  }) {
    const created = await videosRepository.createVideo({
      id: randomUUID(),
      title: input.title,
      url: input.url,
      coverUrl: input.coverUrl,
      description: input.description,
      mimeType: "video/mp4",
      sizeBytes: 0,
      status: "ready",
      uploadedById: input.actorId,
    });
    if (!created) return null;
    return {
      ...created,
      uploadedBy: await usersRepository.findById(input.actorId),
    };
  },

  async getById(videoId: string) {
    const video = await videosRepository.findVideoById(videoId);
    if (!video) return null;
    return {
      ...video,
      uploadedBy: await usersRepository.findById(video.uploadedById),
    };
  },

  async update(input: {
    videoId: string;
    actorId: string;
    title?: string;
    url?: string;
    coverUrl?: string;
    description?: string;
  }) {
    const current = await videosRepository.findVideoById(input.videoId);
    if (!current) return { type: "not_found" as const };
    if (current.uploadedById !== input.actorId)
      return { type: "forbidden" as const };

    const updated = await videosRepository.updateVideo(input.videoId, {
      title: input.title,
      url: input.url,
      coverUrl: input.coverUrl,
      description: input.description,
    });

    if (!updated) return { type: "not_found" as const };

    return {
      type: "ok" as const,
      video: {
        ...updated,
        uploadedBy: await usersRepository.findById(updated.uploadedById),
      },
    };
  },

  async delete(input: { videoId: string; actorId: string }) {
    const current = await videosRepository.findVideoById(input.videoId);
    if (!current) return { type: "not_found" as const };
    if (current.uploadedById !== input.actorId)
      return { type: "forbidden" as const };
    await videosRepository.deleteVideo(input.videoId);
    return { type: "ok" as const };
  },
};
