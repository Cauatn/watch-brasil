import { z } from 'zod'

export const taskIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export const taskItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  done: z.boolean(),
  createdAt: z.string(),
})

export const createTaskInputSchema = z.object({
  title: z.string().min(1),
})

export const updateTaskInputSchema = z
  .object({
    title: z.string().min(1).optional(),
    done: z.boolean().optional(),
  })
  .refine((input) => input.title !== undefined || input.done !== undefined, {
    message: 'At least one field is required',
  })

export type TaskItem = z.infer<typeof taskItemSchema>
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>
