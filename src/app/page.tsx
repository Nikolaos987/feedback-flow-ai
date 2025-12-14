"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions/userActions";

export default function Home() {
  return (
    <div>
      Landing page
      <Button onClick={signOutAction}>Sign out</Button>
    </div>
  );
}
