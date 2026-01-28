import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";

export default function LearnPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Learn</h1>
        <p className="text-muted-foreground">
          Brewing guides, sourcing notes, and drop previews.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/learn/${post.slug}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
