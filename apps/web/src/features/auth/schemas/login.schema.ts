import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

function fieldString(v: unknown) {
  return v == null ? "" : v;
}

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginSchemaMessages = {
  emailInvalid: string;
  passwordRequired: string;
};

export function buildLoginValidationSchema(messages: LoginSchemaMessages) {
  return toTypedSchema(
    z.object({
      email: z.preprocess(
        fieldString,
        z.string().email(messages.emailInvalid),
      ),
      password: z.preprocess(
        fieldString,
        z.string().min(1, messages.passwordRequired),
      ),
    }),
  );
}
