import { z } from "zod";

const uuidSchema = z.string().uuid();

export const commentParamsSchema = z.object({
  id: uuidSchema,
  commentId: uuidSchema,
});

export const videoParamsSchema = z.object({ id: uuidSchema });

export const commentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});
