import { z } from 'zod'

export const moduleItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
})

export const modulesResponseSchema = z.object({
  data: z.array(moduleItemSchema),
})

export type ModuleItem = z.infer<typeof moduleItemSchema>
