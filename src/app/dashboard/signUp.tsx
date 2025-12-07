"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/types/FormSubmitData/signUp";
import { getGithubIssues } from "@/services/feedbackAi";
import { signUpAction } from "../actions/userActions";
import { inngest } from "@/lib/inngest/client";
import { createFeedbackItems } from "../actions/feedbackActions";

export default function SignUp() {
  const [serverErrors, setServerErrors] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpFormSchema),
  });

  async function onSubmit(values: any) {
    const result = await signUpAction(values);

    if (result.errors) {
      setServerErrors(result.errors); // Show server errors
    }
  }

  return (
    <main className="p-8">
      <h1>Create User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
        <input {...register("username")} placeholder="Username..." className="border p-2" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

        <input {...register("name")} placeholder="Name..." className="border p-2" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input type="email" placeholder="Email..." {...register("email")} className="border p-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password..."
          {...register("password")}
          className="border p-2"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {/* SERVER ERRORS */}
        {serverErrors?.email && <p className="text-red-500">Email already in use</p>}
        {serverErrors?.username && <p className="text-red-500">Username already taken</p>}

        <button type="submit" className="bg-blue-500 p-2 text-white">
          Create
        </button>
      </form>

      {/* <button onClick={storeIssues}>create issues</button> */}
    </main>
  );
}
