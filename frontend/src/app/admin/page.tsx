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
  Briefcase,
  GraduationCap,
  Award,
  MessageSquareQuote,
  UserCircle,
  Eye,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Contact } from "@/types";
import {
  fetchProjects,
  fetchSkills,
  fetchAllBlogPosts,
  fetchContacts,
  fetchExperiences,
  fetchEducation,
  fetchCertifications,
  fetchTestimonials,
  fetchProfile,
} from "@/lib/api";

interface Stats {
  projects: number;
  skills: number;
  blogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  unreadContacts: number;
  totalContacts: number;
  experiences: number;
  education: number;
  certifications: number;
  testimonials: number;
  featuredProjects: number;
  featuredTestimonials: number;
  profileComplete: boolean;
  profileName: string;
}

const chartConfig: ChartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          projectsRes,
          skillsRes,
          blogRes,
          contactsRes,
          experiencesRes,
          educationRes,
          certificationsRes,
          testimonialsRes,
          profileRes,
        ] = await Promise.all([
          fetchProjects().catch(() => ({ data: [] })),
          fetchSkills().catch(() => ({ data: [] })),
          fetchAllBlogPosts().catch(() => ({ data: [] })),
          fetchContacts().catch(() => ({ data: [] })),
          fetchExperiences().catch(() => ({ data: [] })),
          fetchEducation().catch(() => ({ data: [] })),
          fetchCertifications().catch(() => ({ data: [] })),
          fetchTestimonials().catch(() => ({ data: [] })),
          fetchProfile().catch(() => ({ data: null })),
        ]);

        const projects = projectsRes.data ?? [];
        const contacts = contactsRes.data ?? [];
        const blogPosts = blogRes.data ?? [];
        const testimonials = testimonialsRes.data ?? [];
        const profile = profileRes.data;

        setStats({
          projects: projects.length,
          skills: (skillsRes.data ?? []).length,
          blogPosts: blogPosts.length,
          publishedPosts: blogPosts.filter((p) => p.published).length,
          draftPosts: blogPosts.filter((p) => !p.published).length,
          unreadContacts: contacts.filter((c) => !c.read).length,
          totalContacts: contacts.length,
          experiences: (experiencesRes.data ?? []).length,
          education: (educationRes.data ?? []).length,
          certifications: (certificationsRes.data ?? []).length,
          testimonials: testimonials.length,
          featuredProjects: projects.filter((p) => p.featured).length,
          featuredTestimonials: testimonials.filter((t) => t.featured).length,
          profileComplete: !!profile?.name && !!profile?.title && !!profile?.bio,
          profileName: profile?.name ?? "",
        });
        setRecentContacts(contacts.slice(0, 5));
      } catch {
        setStats({
          projects: 0,
          skills: 0,
          blogPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          unreadContacts: 0,
          totalContacts: 0,
          experiences: 0,
          education: 0,
          certifications: 0,
          testimonials: 0,
          featuredProjects: 0,
          featuredTestimonials: 0,
          profileComplete: false,
          profileName: "",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      sub: `${stats?.featuredProjects ?? 0} featured`,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Skills",
      value: stats?.skills ?? 0,
      sub: "technologies",
      icon: Wrench,
      href: "/admin/skills",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Blog Posts",
      value: stats?.blogPosts ?? 0,
      sub: `${stats?.publishedPosts ?? 0} published, ${stats?.draftPosts ?? 0} drafts`,
      icon: FileText,
      href: "/admin/blog",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Contacts",
      value: stats?.totalContacts ?? 0,
      sub: `${stats?.unreadContacts ?? 0} unread`,
      icon: Mail,
      href: "/admin/contacts",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Experience",
      value: stats?.experiences ?? 0,
      sub: "positions",
      icon: Briefcase,
      href: "/admin/experience",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Education",
      value: stats?.education ?? 0,
      sub: "entries",
      icon: GraduationCap,
      href: "/admin/education",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Certifications",
      value: stats?.certifications ?? 0,
      sub: "credentials",
      icon: Award,
      href: "/admin/certifications",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials ?? 0,
      sub: `${stats?.featuredTestimonials ?? 0} featured`,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  const chartData = stats
    ? [
        { name: "Projects", count: stats.projects, fill: "hsl(217, 91%, 60%)" },
        { name: "Skills", count: stats.skills, fill: "hsl(160, 84%, 39%)" },
        { name: "Blog", count: stats.blogPosts, fill: "hsl(271, 91%, 65%)" },
        { name: "Experience", count: stats.experiences, fill: "hsl(188, 78%, 41%)" },
        { name: "Education", count: stats.education, fill: "hsl(239, 84%, 67%)" },
        { name: "Certs", count: stats.certifications, fill: "hsl(38, 92%, 50%)" },
        { name: "Reviews", count: stats.testimonials, fill: "hsl(330, 81%, 60%)" },
        { name: "Contacts", count: stats.totalContacts, fill: "hsl(25, 95%, 53%)" },
      ]
    : [];

  const contentSections = stats
    ? [
        {
          label: "Profile",
          icon: UserCircle,
          href: "/admin/profile",
          status: stats.profileComplete ? "Complete" : "Incomplete",
          statusVariant: stats.profileComplete
            ? ("default" as const)
            : ("secondary" as const),
        },
        {
          label: "Skills",
          icon: Wrench,
          href: "/admin/skills",
          count: stats.skills,
        },
        {
          label: "Projects",
          icon: FolderKanban,
          href: "/admin/projects",
          count: stats.projects,
        },
        {
          label: "Experience",
          icon: Briefcase,
          href: "/admin/experience",
          count: stats.experiences,
        },
        {
          label: "Education",
          icon: GraduationCap,
          href: "/admin/education",
          count: stats.education,
        },
        {
          label: "Certifications",
          icon: Award,
          href: "/admin/certifications",
          count: stats.certifications,
        },
        {
          label: "Testimonials",
          icon: MessageSquareQuote,
          href: "/admin/testimonials",
          count: stats.testimonials,
        },
        {
          label: "Blog Posts",
          icon: FileText,
          href: "/admin/blog",
          count: stats.blogPosts,
        },
        {
          label: "Contacts",
          icon: Mail,
          href: "/admin/contacts",
          count: stats.totalContacts,
        },
      ]
    : [];

  const totalContent = stats
    ? stats.projects +
      stats.skills +
      stats.blogPosts +
      stats.experiences +
      stats.education +
      stats.certifications +
      stats.testimonials
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back{stats?.profileName ? `, ${stats.profileName}` : ""}! 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s an overview of your portfolio content. You have{" "}
              <span className="font-semibold text-foreground">
                {totalContent} items
              </span>{" "}
              across all sections.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="size-4" />
                View Portfolio
                <ExternalLink className="size-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    {card.label}
                  </CardDescription>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <card.icon className={`size-4 ${card.color}`} />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">{card.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts + Recent Contacts */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Content Distribution Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <div>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>
                  Overview of your portfolio content by category
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {totalContent === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No content yet. Start adding data to see the chart.
                </p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-orange-500" />
                <div>
                  <CardTitle>Recent Contacts</CardTitle>
                  <CardDescription>Latest messages</CardDescription>
                </div>
              </div>
              {(stats?.unreadContacts ?? 0) > 0 && (
                <Badge variant="default">{stats?.unreadContacts} new</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Mail className="mb-3 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No contacts yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      !contact.read
                        ? "border-primary/20 bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        !contact.read
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`truncate text-sm ${
                            !contact.read ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {contact.name}
                        </p>
                        {!contact.read && (
                          <Badge
                            variant="default"
                            className="shrink-0 px-1.5 py-0 text-[10px]"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs font-medium text-muted-foreground">
                        {contact.subject}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                        {new Date(contact.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/admin/contacts" className="w-full">
              <Button variant="outline" className="w-full" size="sm">
                View All Contacts
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Content Overview + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Content Overview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              <div>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>
                  Manage all sections of your portfolio
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {contentSections.map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <section.icon className="size-4 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {section.label}
                  </span>
                  {"count" in section && typeof section.count === "number" ? (
                    <Badge variant="secondary" className="font-mono">
                      {section.count}
                    </Badge>
                  ) : "status" in section ? (
                    <Badge variant={section.statusVariant}>
                      {section.status}
                    </Badge>
                  ) : null}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link href="/admin/profile">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <UserCircle className="size-4 text-primary" />
                  Edit Profile
                </Button>
              </Link>

              <Separator className="my-1" />

              <Link href="/admin/blog/new">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-purple-500" />
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-blue-500" />
                  Add Project
                </Button>
              </Link>
              <Link href="/admin/skills">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-emerald-500" />
                  Add Skill
                </Button>
              </Link>
              <Link href="/admin/experience">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-cyan-500" />
                  Add Experience
                </Button>
              </Link>
              <Link href="/admin/education">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-indigo-500" />
                  Add Education
                </Button>
              </Link>
              <Link href="/admin/certifications">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-amber-500" />
                  Add Certification
                </Button>
              </Link>
              <Link href="/admin/testimonials">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="size-4 text-pink-500" />
                  Add Testimonial
                </Button>
              </Link>

              <Separator className="my-1" />

              <Link href="/admin/contacts">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Mail className="size-4 text-orange-500" />
                  View Contacts
                  {(stats?.unreadContacts ?? 0) > 0 && (
                    <Badge variant="default" className="ml-auto text-[10px]">
                      {stats?.unreadContacts}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/" target="_blank">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Eye className="size-4 text-muted-foreground" />
                  Preview Portfolio
                  <ExternalLink className="ml-auto size-3 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
