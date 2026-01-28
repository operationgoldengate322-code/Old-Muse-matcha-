import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">About Koyo Club</h1>
        <p className="text-muted-foreground">
          Koyo Club curates matcha with a hospitality mindset: source with care,
          brew with clarity, and deliver a calm monthly ritual.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Curated sourcing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We partner with mills across Japan focused on shade-growing and
            single-cultivar lots. Every tin is tastable and traceable.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Built for consistency</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The sourcing hub keeps our supply chain organized, with outreach,
            lab notes, and pipeline checkpoints.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Owner-only tools</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The private portal handles supplier CRM, tasks, and AI-assisted
            research so you can keep momentum.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Member-first service</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Every drop ships with brew guides, storage tips, and renewal alerts
            to keep the ritual sustainable.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
