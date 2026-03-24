import { count, desc, eq } from "drizzle-orm";
import { db } from "../../shared/db/client.js";
import { commentsTable } from "../../shared/db/schema.js";

export type CommentRecord = {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  createdAt: Date;
};

export const commentsRepository = {
  async createComment(input: {
    id: string;
    videoId: string;
    authorId: string;
    content: string;
  }) {
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
  },

  async listComments(input: { videoId: string; page: number; limit: number }) {
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
  },

  async findCommentById(commentId: string) {
    const comment = await db.query.commentsTable.findFirst({
      where: eq(commentsTable.id, commentId),
    });
    return comment;
  },

  async deleteComment(commentId: string) {
    await db.delete(commentsTable).where(eq(commentsTable.id, commentId));
  },
};
