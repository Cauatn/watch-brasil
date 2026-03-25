import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

function fieldString(v: unknown) {
  return v == null ? "" : v
}

function fieldOptionalString(v: unknown) {
  if (v == null || v === "") return undefined
  return v
}

export const createVideoFormSchema = z.object({
  title: z.preprocess(fieldString, z.string().min(1, "Informe o título")),
  url: z.preprocess(fieldString, z.string().url("URL do vídeo inválida")),
  coverUrl: z.preprocess(
    fieldString,
    z.string().url("URL da capa inválida"),
  ),
  description: z.preprocess(
    fieldOptionalString,
    z.string().max(5000).optional(),
  ),
})

export type CreateVideoFormValues = z.infer<typeof createVideoFormSchema>

export const createVideoValidationSchema = toTypedSchema(createVideoFormSchema)
