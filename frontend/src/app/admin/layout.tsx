"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  UserCircle,
  Wrench,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquareQuote,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, logout } from "@/lib/api";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "main" },
  { label: "Profile", href: "/admin/profile", icon: UserCircle, group: "content" },
  { label: "Skills", href: "/admin/skills", icon: Wrench, group: "content" },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban, group: "content" },
  { label: "Experience", href: "/admin/experience", icon: Briefcase, group: "content" },
  { label: "Education", href: "/admin/education", icon: GraduationCap, group: "content" },
  { label: "Certifications", href: "/admin/certifications", icon: Award, group: "content" },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, group: "content" },
  { label: "Blog", href: "/admin/blog", icon: FileText, group: "publish" },
  { label: "Contacts", href: "/admin/contacts", icon: Mail, group: "publish" },
];

const navGroups = [
  { key: "main", label: "" },
  { key: "content", label: "Content" },
  { key: "publish", label: "Publish & Inbox" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthChecked(true);
      return;
    }
    getCurrentUser()
      .then((res) => {
        setAuthChecked(true);
        setUsername(res.data?.username ?? "Admin");
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace("/admin/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="size-6 animate-pulse text-primary" />
          </div>
          <Skeleton className="h-4 w-32" />
          <p className="text-xs text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  const currentTitle =
    navItems.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/admin" && pathname.startsWith(item.href))
    )?.label ?? "Admin";

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, idx, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + arr.slice(0, idx + 1).join("/"),
    }));

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-semibold"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Shield className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold">Admin Panel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <Separator />

        {/* Grouped nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {navGroups.map((group) => {
            const items = navItems.filter((item) => item.group === group.key);
            return (
              <div key={group.key} className="mb-2">
                {group.label && (
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {group.label}
                  </p>
                )}
                <ul className="flex flex-col gap-0.5">
                  {items.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-primary/10 text-primary shadow-sm"
                              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          <item.icon
                            className={`size-4 transition-transform duration-150 group-hover:scale-110 ${
                              isActive ? "text-primary" : ""
                            }`}
                          />
                          {item.label}
                          {isActive && (
                            <div className="ml-auto size-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <Separator />

        {/* Sidebar footer */}
        <div className="space-y-1 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View Portfolio
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="hidden items-center gap-1 text-sm sm:flex">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                {idx > 0 && (
                  <ChevronRight className="size-3 text-muted-foreground" />
                )}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="font-semibold">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-lg font-semibold sm:hidden">{currentTitle}</h1>

          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="secondary"
              className="hidden gap-1.5 text-xs sm:flex"
            >
              <div className="size-1.5 rounded-full bg-emerald-500" />
              {username}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
