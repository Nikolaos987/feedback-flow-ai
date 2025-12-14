import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signOutAction } from "../../actions/userActions";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Failed</div>;
  }
  return (
    <div>
      You are now signed in! {session.user.email}
      <button onClick={signOutAction}>sign out</button>
    </div>
  );
}
