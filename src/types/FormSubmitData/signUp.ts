import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const signUpFormSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long."),
  name: z.string().min(4, "Name must be at least 4 characters long"),
  email: z.email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters long"),
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
