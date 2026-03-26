import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { ValidationTranslate } from "@/lib/validation-translate";

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function buildSignupValidationSchema(t: ValidationTranslate) {
  return toTypedSchema(
    z
      .object({
        name: z.string().min(1, t("auth.signup.validation.nameRequired")),
        email: z.string().email(t("auth.signup.validation.emailInvalid")),
        password: z.string().min(8, t("auth.signup.validation.passwordMin")),
        confirmPassword: z
          .string()
          .min(1, t("auth.signup.validation.confirmRequired")),
      })
      .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: t("auth.signup.validation.passwordsMismatch"),
      }),
  );
}
