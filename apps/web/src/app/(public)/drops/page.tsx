import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const drops = [
  {
    month: "February",
    title: "Uji + Yame duo",
    notes: "Umami-forward pairing with floral finish.",
  },
  {
    month: "March",
    title: "Kagoshima roast",
    notes: "Warm, nutty profile suited for lattes.",
  },
  {
    month: "April",
    title: "Kyoto spring blend",
    notes: "Bright, grassy, balanced with sweetness.",
  },
];

export default function DropsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Monthly drops</h1>
          <p className="mt-2 text-muted-foreground">
            Preview curated releases and reserve your subscription.
          </p>
        </div>
        <Button asChild>
          <Link href="/plans">Reserve a drop</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {drops.map((drop) => (
          <Card key={drop.month}>
            <CardHeader>
              <CardTitle>{drop.month}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{drop.title}</p>
              <p>{drop.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
