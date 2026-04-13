import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/userActions";
import { getSession, requireSession } from "@/lib/session";
import { mapSessionUserToSidebarUser } from "@/lib/userFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Navbar({
  session,
}: {
  session?: Awaited<ReturnType<typeof requireSession>>;
}) {
  const currentSession = session ?? (await getSession());
  const user = currentSession ? mapSessionUserToSidebarUser(currentSession) : null;

  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-20
        overflow-hidden border-b backdrop-blur"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href={"/"} className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="text-primary h-6 w-6" />
          FeedbackFlow AI
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#features"
            className="text-muted-foreground hover:text-foreground text-sm font-medium
              transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-muted-foreground hover:text-foreground text-sm font-medium
              transition-colors"
          >
            How It Works
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.avatar && (
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name}
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer p-0">
                  <form action={signOutAction} className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signin">
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
