import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAdminLoggedIn, adminLogout } from "@/lib/admin-auth";
import { CREST_URL, ORG } from "@/lib/site";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Users,
  CalendarDays,
  Newspaper,
  FolderKanban,
  Megaphone,
  BarChart3,
  Mail,
  LogOut,
  LayoutDashboard,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "members", label: "Members", icon: Users },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "news", label: "News", icon: Newspaper },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "stats", label: "Impact Stats", icon: BarChart3 },
  { id: "contact", label: "Messages", icon: Mail },
] as const;

export type AdminSection = (typeof NAV_ITEMS)[number]["id"];

export default function AdminLayout({
  active,
  onNavigate,
  pendingCount,
  children,
}: {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  pendingCount?: number;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate({ to: "/admin-login" });
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-white/10 bg-zinc-900 text-white">
          <SidebarHeader className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <img src={CREST_URL} alt="GCN 09" className="h-9 w-9 rounded-lg" />
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-bold leading-tight text-white">{ORG.short}</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                  Control Centre
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-zinc-500">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active === item.id}
                        onClick={() => onNavigate(item.id)}
                        className={
                          active === item.id
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }
                        tooltip={item.label}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                        {item.id === "members" && pendingCount !== undefined && pendingCount > 0 && (
                          <Badge className="ml-auto bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0" variant="outline">
                            {pendingCount}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        adminLogout();
                        navigate({ to: "/admin-login" });
                      }}
                      className="text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                      tooltip="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-zinc-900/80 px-4 backdrop-blur-md">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <Separator orientation="vertical" className="h-5 bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>
                <span className="font-semibold text-white">{ORG.short}</span>{" "}
                <span className="hidden sm:inline">Admin Dashboard</span>
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-zinc-500 hidden sm:inline">Signed in as admin</span>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
