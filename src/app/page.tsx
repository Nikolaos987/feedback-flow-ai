import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export default function Home() {
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    await prisma.user.create({
      data: {
        id: "1",
        name,
        email,
      },
    });
  }

  return (
    <main className="p-8">
      <h1>Create User</h1>

      <form action={createUser} className="mt-4 flex flex-col gap-4">
        <input type="text" name="name" placeholder="Name..." className="border p-2" />
        <input type="email" name="email" placeholder="Email..." className="border p-2" />
        <button type="submit" className="bg-blue-500 p-2 text-white">
          Create
        </button>
      </form>
    </main>
  );
}
