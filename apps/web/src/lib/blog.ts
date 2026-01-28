export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string[];
};

const posts: BlogPost[] = [
  {
    slug: "matcha-brewing-ritual",
    title: "The matcha brewing ritual",
    excerpt:
      "A quick guide to setting up your tools, ratios, and water temperature.",
    date: "2026-01-08",
    content: [
      "Start with water between 160-175°F to keep the matcha sweet and smooth.",
      "Sift your powder before whisking to avoid clumps.",
      "Whisk in a zig-zag motion for 15-20 seconds until foam forms.",
    ],
  },
  {
    slug: "how-we-curate-drops",
    title: "How we curate monthly drops",
    excerpt:
      "From farm outreach to sampling, learn how each drop is selected.",
    date: "2026-01-12",
    content: [
      "Each drop begins with small lot sampling from long-term partner mills.",
      "We evaluate flavor, color, aroma, and brewing versatility.",
      "Final selections include brewing notes and origin context.",
    ],
  },
  {
    slug: "storage-tips",
    title: "Storage tips for peak freshness",
    excerpt: "Keep your matcha bright with these storage guidelines.",
    date: "2026-01-20",
    content: [
      "Store unopened tins in the fridge for best preservation.",
      "Once opened, keep matcha in a cool, dark cupboard with a tight seal.",
      "Finish within 3-4 weeks for optimal flavor.",
    ],
  },
];

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null;
}
