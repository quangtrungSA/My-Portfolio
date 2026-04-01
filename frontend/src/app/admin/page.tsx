"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  FileText,
  Mail,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/types";
import {
  fetchProjects,
  fetchSkills,
  fetchAllBlogPosts,
  fetchContacts,
} from "@/lib/api";

interface Stats {
  projects: number;
  skills: number;
  blogPosts: number;
  unreadContacts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, skillsRes, blogRes, contactsRes] =
          await Promise.all([
            fetchProjects(),
            fetchSkills(),
            fetchAllBlogPosts(),
            fetchContacts(),
          ]);

        const contacts = contactsRes.data ?? [];
        setStats({
          projects: (projectsRes.data ?? []).length,
          skills: (skillsRes.data ?? []).length,
          blogPosts: (blogRes.data ?? []).length,
          unreadContacts: contacts.filter((c) => !c.read).length,
        });
        setRecentContacts(contacts.slice(0, 5));
      } catch {
        // Silently handle - data may not be available yet
        setStats({ projects: 0, skills: 0, blogPosts: 0, unreadContacts: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: stats?.projects ?? 0,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Skills",
      value: stats?.skills ?? 0,
      icon: Wrench,
      href: "/admin/skills",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts ?? 0,
      icon: FileText,
      href: "/admin/blog",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Unread Contacts",
      value: stats?.unreadContacts ?? 0,
      icon: Mail,
      href: "/admin/contacts",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{card.label}</CardDescription>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <card.icon className={`size-5 ${card.color}`} />
                  </div>
                </div>
                <CardTitle className="text-3xl">{card.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Contacts</CardTitle>
              <Link href="/admin/contacts">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No contacts yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {contact.name}
                        </p>
                        {!contact.read && (
                          <Badge variant="default" className="text-[10px]">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {contact.subject}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump to common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/admin/blog/new">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="size-4" />
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="size-4" />
                  Add Project
                </Button>
              </Link>
              <Link href="/admin/skills">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="size-4" />
                  Add Skill
                </Button>
              </Link>
              <Link href="/admin/profile">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ArrowRight className="size-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
