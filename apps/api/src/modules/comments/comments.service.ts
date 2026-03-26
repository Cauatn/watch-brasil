import { randomUUID } from "node:crypto";
import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { commentsTable } from "../../db/schema.js";
import { findUserById } from "../users/users.service.js";
import { findVideoById } from "../videos/videos.service.js";

const createComment = async (input: {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
}) => {
  await db.insert(commentsTable).values({
    id: input.id,
    videoId: input.videoId,
    authorId: input.authorId,
    content: input.content,
    createdAt: new Date(),
  });
  const created = await db.query.commentsTable.findFirst({
    where: eq(commentsTable.id, input.id),
  });
  return created;
};

const listComments = async (input: {
  videoId: string;
  page: number;
  limit: number;
}) => {
  const offset = (input.page - 1) * input.limit;

  const [data, totalResult] = await Promise.all([
    db.query.commentsTable.findMany({
      where: eq(commentsTable.videoId, input.videoId),
      orderBy: [desc(commentsTable.createdAt)],
      limit: input.limit,
      offset,
    }),
    db
      .select({ value: count(commentsTable.id) })
      .from(commentsTable)
      .where(eq(commentsTable.videoId, input.videoId)),
  ]);

  return {
    data: data,
    total: Number(totalResult[0]?.value ?? 0),
    page: input.page,
    limit: input.limit,
  };
};

const findCommentById = async (commentId: string) => {
  const comment = await db.query.commentsTable.findFirst({
    where: eq(commentsTable.id, commentId),
  });
  return comment;
};

const deleteComment = async (commentId: string) => {
  await db.delete(commentsTable).where(eq(commentsTable.id, commentId));
};

export const commentsService = {
  async list(input: { videoId: string; page: number; limit: number }) {
    const video = await findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const paginated = await listComments(input);
    const data = await Promise.all(
      paginated.data.map(async (comment) => ({
        ...comment,
        author: await findUserById(comment.authorId),
      })),
    );

    return { type: "ok" as const, ...paginated, data };
  },

  async create(input: { videoId: string; actorId: string; content: string }) {
    const video = await findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const created = await createComment({
      id: randomUUID(),
      videoId: input.videoId,
      authorId: input.actorId,
      content: input.content,
    });
    if (!created) return { type: "video_not_found" as const };

    const comment = {
      ...created,
      author: await findUserById(created.authorId),
    };

    return { type: "ok" as const, comment };
  },

  async delete(input: { videoId: string; commentId: string; actorId: string }) {
    const video = await findVideoById(input.videoId);
    if (!video) return { type: "video_not_found" as const };

    const comment = await findCommentById(input.commentId);
    if (!comment || comment.videoId !== input.videoId)
      return { type: "not_found" as const };
    if (comment.authorId !== input.actorId)
      return { type: "forbidden" as const };

    await deleteComment(comment.id);
    return { type: "ok" as const };
  },
};
