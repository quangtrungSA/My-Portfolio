import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost, ApiResponse } from "@/types";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.API_BASE_URL || "http://localhost:8080";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest blog posts about development and technology.",
};

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/blog-posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json: ApiResponse<BlogPost[]> = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-20 pt-28">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="mb-2 text-4xl font-bold">Blog</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Thoughts, tutorials, and insights about development.
        </p>

        {posts.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-xl">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    {post.excerpt && (
                      <p className="mb-4 text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {post.createdAt &&
                          format(new Date(post.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="flex gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
