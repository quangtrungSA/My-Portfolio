import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Rss } from "lucide-react";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog | Ly Van Quang Trung",
  description:
    "Thoughts, tutorials, and insights about software development — Java, Next.js, DevOps, and more.",
};

function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/blog-posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
  const featured = posts[0];
  const rest = posts.slice(1);
  const totalReadTime = posts.reduce((a, p) => a + estimateReadTime(p.content), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/5 pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(var(--primary),0.12),transparent)]" />
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="group gap-1.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <Rss className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Blog
              </span>
            </div>
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">
            Articles &amp;{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Deep dives into software engineering — Java, Next.js, DevOps, system design,
            and lessons learned building real-world applications.
          </p>

          {/* Tag cloud */}
          <div className="mt-8 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-default rounded-full px-3 py-1 text-xs transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/40"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl px-4 pb-24">
        {/* ── Stats bar ── */}
        <div className="my-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-b pb-8">
          <span className="font-semibold text-foreground text-base">
            {posts.length} Articles
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{allTags.length} Topics</span>
          <span className="hidden sm:inline">·</span>
          <span>~{totalReadTime} min total reading time</span>
        </div>

        {/* ── Featured Post ── */}
        {featured && (
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Featured Post
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="grid overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 lg:grid-cols-5">
              {/* Image — takes 3/5 on large screens */}
              <div className="relative aspect-video overflow-hidden lg:col-span-3 lg:aspect-auto">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-0 shadow">
                    ✦ Featured
                  </Badge>
                </div>
              </div>

              {/* Content — takes 2/5 */}
              <div className="flex flex-col justify-center p-7 lg:col-span-2 lg:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="mb-3 text-2xl font-bold leading-snug transition-colors group-hover:text-primary lg:text-3xl">
                  {featured.title}
                </h2>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="mb-6 flex items-center gap-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(featured.createdAt), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {estimateReadTime(featured.content)} min read
                  </span>
                </div>
                <Button className="w-fit gap-2 group/btn">
                  Read Article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </Link>
        </section>
        )}

        {/* ── All Articles ── */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              All Articles
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{rest.length} posts</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-full font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs rounded-full font-normal">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <h2 className="mb-2 line-clamp-2 flex-none text-sm font-semibold leading-snug transition-colors group-hover:text-primary md:text-base">
                      {post.title}
                    </h2>

                    <p className="mb-4 line-clamp-2 flex-1 text-xs text-muted-foreground leading-relaxed md:text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {estimateReadTime(post.content)} min read
                      </span>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className="border-t bg-muted/30 px-5 py-2.5 transition-colors group-hover:bg-primary/5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-200 opacity-0 group-hover:opacity-100">
                      Read article <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-xs text-transparent select-none group-hover:hidden">.</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
