export interface AppSidebarProps {
  user: SessionUser;
}

export interface SessionUser {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}
