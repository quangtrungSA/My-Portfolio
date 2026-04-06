import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Share2 } from "lucide-react";

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/blog-posts/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json ?? null;
  } catch {
    return null;
  }
}

async function fetchAllPosts(): Promise<BlogPost[]> {
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

function getRelatedPosts(post: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[] {
  return allPosts
    .filter((p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, limit);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allPosts] = await Promise.all([
    fetchPostBySlug(params.slug),
    fetchAllPosts(),
  ]);
  if (!post) notFound();

  const related = getRelatedPosts(post, allPosts, 3);
  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Cover image hero ── */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96 lg:h-[480px]">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back button overlaid on image */}
        <div className="absolute left-4 top-24 sm:left-8">
          <Link href="/blog">
            <Button
              variant="outline"
              size="sm"
              className="group gap-1.5 bg-background/70 backdrop-blur-sm border-white/20 hover:bg-background"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              All Articles
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Article header ── */}
      <main className="container mx-auto max-w-3xl px-4 pb-24">
        <div className="-mt-24 relative z-10 mb-10">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              ~{post.content.split(/\s+/).length} words
            </span>
          </div>

          {/* Divider */}
          <div className="mt-6 h-px bg-border" />
        </div>

        {/* ── Article body ── */}
        <article
          className="prose prose-base dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-foreground/90
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-foreground
            prose-pre:rounded-xl prose-pre:border prose-pre:bg-muted/60 prose-pre:shadow-sm
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-xl prose-img:shadow-md
            prose-ul:space-y-1 prose-ol:space-y-1
            prose-li:text-foreground/90
            prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Share / actions ── */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-muted/30 p-5">
          <div>
            <p className="text-sm font-semibold">Enjoyed this article?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share it with your network or explore more posts below.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              render={
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://frontend-two-tan-77.vercel.app/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Link href="/blog">
              <Button size="sm" className="gap-2">
                More Articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Related Articles
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} className="group">
                  <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex flex-wrap gap-1">
                        {rel.tags.slice(0, 1).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                        {rel.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {estimateReadTime(rel.content)} min read
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


