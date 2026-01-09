"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { smartSignIn } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { googleSignIn } from "@/lib/auth-client";
import { ComponentProps } from "react";
import FormFieldWrapper from "@/components/form/formFieldWrapper";

const LoginSchema = z.object({
  username: z.string().min(6, "username must have at least 6 characters"),
  password: z.string().min(8, "password must have at least 8 characters"),
});
export type LoginValues = z.infer<typeof LoginSchema>;

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginValues) => {
      return smartSignIn(data);
    },
    onSuccess: () => router.push("/"),
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or suername below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation?.mutate(data))}>
              <FieldGroup>
                <FormFieldWrapper
                  name="username"
                  label="Email or Username"
                  placeholder="example: m@example.com"
                />

                <FormFieldWrapper inputType="password" name="password" label="Password" placeholder="Enter a safe password" />

                <Field>
                  <Button type="submit">Login</Button>
                  <Button variant="outline" onClick={googleSignIn} type="button">
                    Login with Google
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link href={"/signup"}>Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
