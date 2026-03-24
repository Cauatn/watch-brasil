import { randomUUID } from "node:crypto";
import { usersRepository } from "../users/users.repository.js";
import { videosRepository } from "../videos/videos.repository.js";
import { commentsRepository } from "./comments.repository.js";

export const commentsService = {
  async list(input: { videoId: string; page: number; limit: number }) {
    const video = await videosRepository.findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const paginated = await commentsRepository.listComments(input);
    const data = await Promise.all(
      paginated.data.map(async (comment) => ({
        ...comment,
        author: await usersRepository.findById(comment.authorId),
      })),
    );

    return { type: "ok" as const, ...paginated, data };
  },

  async create(input: { videoId: string; actorId: string; content: string }) {
    const video = await videosRepository.findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const created = await commentsRepository.createComment({
      id: randomUUID(),
      videoId: input.videoId,
      authorId: input.actorId,
      content: input.content,
    });
    if (!created) return { type: "video_not_found" as const };

    const comment = {
      ...created,
      author: await usersRepository.findById(created.authorId),
    };

    return { type: "ok" as const, comment };
  },

  async delete(input: { videoId: string; commentId: string; actorId: string }) {
    const video = await videosRepository.findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const comment = await commentsRepository.findCommentById(input.commentId);
    if (!comment || comment.videoId !== input.videoId)
      return { type: "not_found" as const };
    if (comment.authorId !== input.actorId)
      return { type: "forbidden" as const };

    await commentsRepository.deleteComment(comment.id);
    return { type: "ok" as const };
  },
};
