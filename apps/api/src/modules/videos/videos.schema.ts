import { z } from "zod";

const uuidSchema = z.string().uuid();

export const videoParamsSchema = z.object({ id: uuidSchema });

export const createVideoSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  coverUrl: z.url(),
  description: z.string().optional(),
});

export const listVideosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(20),
  status: z.enum(["processing", "ready", "error"]).optional(),
  uploadedBy: uuidSchema.optional(),
  search: z.string().trim().max(200).optional(),
});

export const updateVideoSchema = z.object({
  title: z.string().min(2),
  url: z.url().optional(),
  coverUrl: z.url().optional(),
  description: z.string().optional(),
});
