import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "Choose a plan",
    description: "Select your monthly cadence and matcha styles.",
  },
  {
    title: "We curate the drop",
    description: "Receive a pairing of ceremonial tins and brew notes.",
  },
  {
    title: "Pause or skip anytime",
    description: "Manage your subscription from your account portal.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="space-y-4">
        <Badge variant="success">How it works</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          A matcha ritual delivered monthly.
        </h1>
        <p className="text-muted-foreground">
          Koyo Club blends small-batch sourcing with thoughtful logistics so
          each drop arrives on time.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle>
                <span className="mr-2 text-sm text-muted-foreground">
                  0{index + 1}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {step.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
