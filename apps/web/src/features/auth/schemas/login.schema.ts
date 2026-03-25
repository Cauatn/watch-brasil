import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const loginShape = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginFormValues = z.infer<typeof loginShape>;

export type LoginSchemaMessages = {
  emailInvalid: string;
  passwordRequired: string;
};

export function buildLoginValidationSchema(messages: LoginSchemaMessages) {
  return toTypedSchema(
    z.object({
      email: z.string().email(messages.emailInvalid),
      password: z.string().min(1, messages.passwordRequired),
    }),
  );
}
