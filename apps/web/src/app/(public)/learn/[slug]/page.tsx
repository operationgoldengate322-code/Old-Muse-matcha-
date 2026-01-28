import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default function LearnPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{post.date}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-muted-foreground">{post.excerpt}</p>
      </div>
      <div className="mt-8 space-y-4 text-base leading-7 text-foreground">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
