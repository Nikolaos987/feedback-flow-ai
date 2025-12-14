import { signUpAction, smartSignIn } from "@/app/actions/userActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import z from "zod";
import { googleSignIn } from "@/lib/auth-client";
import Link from "next/link";

const SignupSchema = z
  .object({
    username: z.string().min(6, "username must have at least 6 characters"),
    name: z.string().min(6, "name must have at least 6 characters"),
    email: z.email(),
    password: z.string().min(8, "password must have at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignupValues = z.infer<typeof SignupSchema>;
export type SignupPayload = Omit<SignupValues, "confirmPassword">;

export default function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [serverErrors, setServerErrors] = useState<any>(null);
  const router = useRouter();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupPayload) => {
      const result = await signUpAction(data);

      if (result.errors) {
        setServerErrors(result.errors); // Show server errors
      }
    },
    onSuccess: () => router.push("/"),
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(({ confirmPassword, ...data }) => mutation?.mutate(data))}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    data-invalid={fieldState.invalid}
                    id="name"
                    placeholder="John Doe..."
                  />
                  <FieldDescription>
                    This name will be visible as your display name inside the app.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    data-invalid={fieldState.invalid}
                    id="username"
                    placeholder="Username..."
                  />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    data-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email with anyone
                    else.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    data-invalid={fieldState.invalid}
                    id="password"
                    type="password"
                  />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    data-invalid={fieldState.invalid}
                    id="confirmPassword"
                    type="password"
                  />
                  {fieldState.error && (
                    <FieldDescription>{fieldState.error.message}</FieldDescription>
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" onClick={googleSignIn} type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href={"/signin"}>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
