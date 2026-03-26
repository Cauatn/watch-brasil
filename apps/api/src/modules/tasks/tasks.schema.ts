import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "in_progress", "done"]);
export const taskCategorySchema = z.enum(["general", "watch_movie"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: taskStatusSchema.optional().default("pending"),
  category: taskCategorySchema.optional().default("general"),
  videoId: z.string().uuid().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: taskStatusSchema.optional(),
  category: taskCategorySchema.optional(),
  videoId: z.string().uuid().nullable().optional(),
});

export const taskParamsSchema = z.object({
  id: z.string().uuid(),
});

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  category: taskCategorySchema.optional(),
});
