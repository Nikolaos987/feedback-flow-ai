"use server";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function smartSignIn(formData: FormData) {
  const identifier = formData.get("username") as string;
  const password = formData.get("password") as string;

  /** search for the user that matches either the email or username in the User table in the database */
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    select: { email: true, username: true },
  });

  if (!user) throw new Error("Invalid credentials.");

  user.email === identifier
    ? await auth.api.signInEmail({ body: { email: identifier, password } })
    : await auth.api.signInUsername({ body: { username: identifier, password } });

  return { success: true };
}

export async function signUpAction(formData: FormData) {
  const { username, name, email, password } = Object.fromEntries(formData.entries()) as {
    username: string;
    name: string;
    email: string;
    password: string;
  };

  const result = await auth.api.signUpEmail({
    body: {
      username,
      name,
      email,
      password,
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
