"use server";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction() {
  // const email = formData.get("email") as string;
  // const password = formData.get("password") as string;

  const result = await auth.api.signInEmail({
    body: {
      email: "test1@gmail.com",
      password: "Aa123456",
    },
  });

  return { success: true };
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password: "Aa123456",
      name,
      callbackURL: "/dashboard",
    },
  });

  return { success: true };
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}
