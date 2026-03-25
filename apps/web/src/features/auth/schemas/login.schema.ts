import { toTypedSchema } from "@vee-validate/zod";
import type { ValidationTranslate } from "@/lib/validation-translate";
import { z } from "zod";

export type LoginFormValues = {
  email: string;
  password: string;
};

export function buildLoginValidationSchema(t: ValidationTranslate) {
  return toTypedSchema(
    z.object({
      email: z.email(t("auth.login.validation.emailInvalid")),
      password: z.string().min(1, t("auth.login.validation.passwordRequired")),
    }),
  );
}
