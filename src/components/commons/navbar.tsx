import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/userActions";

export default function Navbar() {
  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0
        overflow-hidden border-b backdrop-blur"
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="text-primary h-6 w-6" />
          FeedbackFlow AI
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground text-sm font-medium
              transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground text-sm font-medium
              transition-colors"
          >
            How It Works
          </Link>
          <Link href="/app/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
          <Button className="bg-destructive" onClick={signOutAction}>
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
