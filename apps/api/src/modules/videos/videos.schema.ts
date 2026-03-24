import { z } from "zod";

const uuidSchema = z.string().uuid();

export const videoParamsSchema = z.object({ id: uuidSchema });

export const createVideoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
});

export const listVideosQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["processing", "ready", "error"]).optional(),
  uploadedBy: uuidSchema.optional(),
});

export const updateVideoSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
  })
  .refine((v) => v.title !== undefined || v.description !== undefined, {
    message: "At least one field is required",
  });
