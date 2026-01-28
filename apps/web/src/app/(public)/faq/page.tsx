import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    q: "When are drops shipped?",
    a: "Drops ship during the first week of each month with tracking updates.",
  },
  {
    q: "Can I pause or skip?",
    a: "Yes. Use your account portal to pause, skip, or cancel anytime.",
  },
  {
    q: "Do you offer one-time purchases?",
    a: "Limited tins are available in the shop once subscribers are fulfilled.",
  },
  {
    q: "Is the owner portal included?",
    a: "The owner portal is private and available only to internal operators.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
        <p className="text-muted-foreground">
          Everything you need to know about subscriptions and drops.
        </p>
      </div>
      <div className="mt-10 space-y-4">
        {faqs.map((item) => (
          <Card key={item.q}>
            <CardHeader>
              <CardTitle>{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.a}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
