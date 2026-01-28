import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "Monthly Matcha Drops",
    description:
      "Small-batch, single-origin matcha curated by origin, flavor, and brewing style.",
  },
  {
    title: "Sourcing Intelligence",
    description:
      "Owner-only CRM, pipeline, and AI research that keeps supplier outreach tight.",
  },
  {
    title: "Flexible Subscription",
    description:
      "Pause, skip, or swap with transparent shipping and renewal notifications.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-matcha-100 px-3 py-1 text-xs font-semibold text-matcha-800">
            Curated matcha + owner sourcing hub
          </span>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Koyo Club delivers ritual-grade matcha on a calm, monthly cadence.
          </h1>
          <p className="text-lg text-muted-foreground">
            Subscribe to matcha drops built for daily practice and supported by a
            private, AI-assisted sourcing workspace for owners.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/plans">Choose a plan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/how-it-works">How it works</Link>
            </Button>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div>
              <p className="text-2xl font-semibold text-foreground">12</p>
              <p>origin partners</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">3-5</p>
              <p>tins per drop</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">48h</p>
              <p>brewing support</p>
            </div>
          </div>
        </div>
        <Card className="border-matcha-200 bg-matcha-50">
          <CardHeader>
            <CardTitle>Next drop preview</CardTitle>
            <CardDescription>
              Early February — Uji + Yame ceremonial duo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 30g Uji Okumidori, clean umami finish</li>
              <li>• 30g Yame Saemidori, soft cocoa notes</li>
              <li>• Brew guide + origin story card</li>
            </ul>
            <Button variant="secondary" asChild>
              <Link href="/drops">Explore drops</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
