import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

export const createVideoFormSchema = z.object({
  title: z.string().min(1, "Informe o título"),
  url: z.string().url("URL do vídeo inválida"),
  coverUrl: z.string().url("URL da capa inválida"),
  description: z.string().max(5000).optional(),
})

export type CreateVideoFormValues = z.infer<typeof createVideoFormSchema>

export const createVideoValidationSchema = toTypedSchema(createVideoFormSchema)
