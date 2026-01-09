import { signUpAction, smartSignIn } from "@/app/actions/userActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import z from "zod";
import { googleSignIn } from "@/lib/auth-client";
import Link from "next/link";
import FormFieldWrapper from "@/components/form/formFieldWrapper";

const SignupSchema = z.object({
  username: z.string().min(6, "username must have at least 6 characters"),
  name: z.string().min(6, "name must have at least 6 characters"),
  email: z.email(),
  password: z.string().min(8, "password must have at least 8 characters"),
  // confirmPassword: z
  //   .string("Please enter the password again")
  //   .min(8, "password must have at least 8 characters"),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });
export type SignupValues = z.infer<typeof SignupSchema>;
export type SignupPayload = Omit<SignupValues, "confirmPassword">;

export default function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [serverErrors, setServerErrors] = useState<any>(null);
  const router = useRouter();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    criteriaMode: "all",
    defaultValues: { name: "", username: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupValues) => {
      const result = await signUpAction(data);
      return result;
    },
    onSuccess: () => router.push("/"),
    onError: (errors) => {
      setServerErrors(errors);
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(({ ...data }) => mutation?.mutate(data))}>
            <FieldGroup>
              <FormFieldWrapper
                name="name"
                label="Full name"
                placeholder="John Doe"
                description="This name will be visible as your display name inside the app."
              />

              <FormFieldWrapper
                name="username"
                placeholder="enter your username"
                label="Username"
              />

              <FormFieldWrapper
                name="email"
                label="Email"
                placeholder="m@example.com"
                description="We'll use this to contact you. We will not share your email with anyone else."
              />

              <FormFieldWrapper
                inputType="password"
                name="password"
                label="Password"
                description="Must be at least 8 characters long."
              />

              {/* <FormFieldWrapper
                inputType="password"
                name="confirmPassword"
                label="Confirm Password"
              /> */}

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
          {serverErrors && serverErrors}
        </FormProvider>
      </CardContent>
    </Card>
  );
}
