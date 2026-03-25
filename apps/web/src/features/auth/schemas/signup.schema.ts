import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

function fieldString(v: unknown) {
  return v == null ? "" : v;
}

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignupSchemaMessages = {
  nameRequired: string;
  emailInvalid: string;
  passwordMin: string;
  confirmRequired: string;
  passwordsMismatch: string;
};

export function buildSignupValidationSchema(messages: SignupSchemaMessages) {
  return toTypedSchema(
    z
      .object({
        name: z.preprocess(
          fieldString,
          z.string().min(1, messages.nameRequired),
        ),
        email: z.preprocess(
          fieldString,
          z.string().email(messages.emailInvalid),
        ),
        password: z.preprocess(
          fieldString,
          z.string().min(8, messages.passwordMin),
        ),
        confirmPassword: z.preprocess(
          fieldString,
          z.string().min(1, messages.confirmRequired),
        ),
      })
      .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: messages.passwordsMismatch,
      }),
  );
}
