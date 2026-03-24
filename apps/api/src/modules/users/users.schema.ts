import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    password: z.string().min(8).optional(),
  })
  .refine((v) => v.name !== undefined || v.password !== undefined, {
    message: "At least one field is required",
  });
