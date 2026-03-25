import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const signupFormSchema = z
  .object({
    name: z.string().min(1, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem",
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export const signupValidationSchema = toTypedSchema(signupFormSchema);

