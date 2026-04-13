import { SessionUser } from "@/types/user/session";
import { requireSession } from "./session";

function getInitials(value: string) {
  const cleanValue = value.trim();
  if (!cleanValue) return "U";

  if (cleanValue.includes("@")) {
    const localPart = cleanValue.split("@")[0] ?? "";
    return localPart.slice(0, 2).toUpperCase() || "U";
  }

  const parts = cleanValue.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return cleanValue.slice(0, 2).toUpperCase();
}

export function mapSessionUserToSidebarUser(
  session: Awaited<ReturnType<typeof requireSession>>,
): SessionUser {
  const name = session.user.name?.trim() || session.user.email.split("@")[0] || "User";
  const email = session.user.email;

  return {
    name,
    email,
    avatar: session.user.image ?? "",
    initials: getInitials(name),
  };
}
