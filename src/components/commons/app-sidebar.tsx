"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Inbox, Info, Sparkles, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/userActions";
import { requireSession } from "@/lib/session";
import { mapSessionUserToSidebarUser } from "@/lib/userFunctions";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: Inbox,
  },
  {
    title: "About",
    href: "/app/about",
    icon: Info,
  },
];

export default function AppSidebar({
  session,
}: {
  session: Awaited<ReturnType<typeof requireSession>>;
}) {
  const pathname = usePathname();
  const user = mapSessionUserToSidebarUser(session);

  return (
    <Sidebar>
      {/* Header / Brand */}
      <SidebarHeader>
        <Link href={"/"} className="flex h-16 items-center gap-2 px-4 font-semibold">
          <Sparkles className="text-sidebar-primary h-5 w-5" />
          <span>FeedbackFlow AI</span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User / Footer */}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2">
              <Avatar className="h-9 w-9">
                {user?.avatar && (
                  <AvatarImage src={user?.avatar} alt={user?.name} referrerPolicy="no-referrer" />
                )}
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
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
            <DropdownMenuItem onClick={signOutAction} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
