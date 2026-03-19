import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signOutAction } from "../../actions/userActions";
import Dashboard from "@/components/features/dashboard/dashboard";

export default async function DashboardPage() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session) {
  //   return <div>Failed</div>;
  // }

  return <Dashboard />;
}
