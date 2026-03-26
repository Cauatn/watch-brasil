import { toTypedSchema } from "@vee-validate/zod";
import type { ValidationTranslate } from "@/lib/validation-translate";
import { z } from "zod";

function fieldString(v: unknown) {
  return v == null ? "" : v;
}

function fieldOptionalString(v: unknown) {
  if (v == null || v === "") return undefined;
  return v;
}

export type CreateVideoFormValues = {
  title: string;
  url: string;
  coverUrl: string;
  description?: string;
};

export function buildCreateVideoValidationSchema(t: ValidationTranslate) {
  return toTypedSchema(
    z.object({
      title: z.preprocess(
        fieldString,
        z.string().min(1, t("addVideo.validation.titleRequired")),
      ),
      url: z.preprocess(
        fieldString,
        z.url(t("addVideo.validation.videoUrlInvalid")),
      ),
      coverUrl: z.preprocess(
        fieldString,
        z.url(t("addVideo.validation.coverUrlInvalid")),
      ),
      description: z.preprocess(
        fieldOptionalString,
        z.string().max(5000).optional(),
      ),
    }),
  );
}
