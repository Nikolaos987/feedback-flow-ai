"use client";

import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { signUpAction, smartSignIn } from "./actions/userActions";

export default function Home() {
  const handleSignUp = async (formData: FormData) => {
    const res = await signUpAction(formData);
  };

  return (
    <main className="p-8">
      <h1>Create User</h1>

      <form action={handleSignUp} className="mt-4 flex flex-col gap-4">
        <input type="text" name="username" placeholder="Username..." className="border p-2" />
        <input type="text" name="name" placeholder="Name..." className="border p-2" />
        <input type="email" name="email" placeholder="Email..." className="border p-2" />
        <input type="password" name="password" placeholder="Password..." className="border p-2" />

        <button type="submit" className="bg-blue-500 p-2 text-white">
          Create
        </button>
      </form>
    </main>
  );
}
