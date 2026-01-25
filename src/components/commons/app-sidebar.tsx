"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Info, Inbox, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOutAction } from "@/app/actions/userActions";

const navItems = [
  {
    title: "Dashboard",
    href: "/app/dashboard",
    icon: BarChart3,
  },
  {
    title: "Inbox",
    href: "/app/inbox",
    icon: Inbox,
  },
  {
    title: "About",
    href: "/app/about",
    icon: Info,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const mockUser = {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "https://pngtree.com/free-png-vectors/avatar", // "/public/profile-avatar.png",
    initials: "SJ",
  };

  return (
    <div className="bg-sidebar flex h-full flex-col gap-2 border-r">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <Sparkles className="text-sidebar-primary h-5 w-5" />
        <span className="text-sidebar-foreground">FeedbackFlow AI</span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : `text-sidebar-foreground hover:bg-sidebar-accent
                    hover:text-sidebar-accent-foreground`,
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-sidebar-accent focus-visible:ring-sidebar-ring w-full rounded-lg
                transition-colors focus:outline-none focus-visible:ring-2"
              variant={"ghost"}
            >
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                  <AvatarFallback
                    className="bg-sidebar-primary text-sidebar-primary-foreground text-sm
                      font-medium"
                  >
                    {mockUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                  <p className="text-sidebar-foreground w-full truncate text-sm font-medium">
                    {mockUser.name}
                  </p>
                  <p className="text-sidebar-foreground/60 w-full truncate text-xs">
                    {mockUser.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-muted-foreground text-xs">{mockUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutAction} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
