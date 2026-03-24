import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const loginValidationSchema = toTypedSchema(loginFormSchema);
