import { z } from "zod";

export const signUpFormSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long."),
  name: z.string().min(4, "Name must be at least 4 characters long"),
  email: z.email("Please enter a valid email.").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Contain at least one letter.")
    .regex(/[0-9]/, "Contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),
});

export type SignUpActionState = {
  form?: {
    username: string;
    name: string;
    email: string;
    password: string;
  };
  errors?: {
    username: string[];
    name: string[];
    email: string[];
    password: string[];
  };
};
