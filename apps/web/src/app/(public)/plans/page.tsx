import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SubscribeButton } from "@/components/subscribe-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PlansPage() {
  const supabase = createSupabaseServerClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("id, name, price_cents, interval, active")
    .eq("active", true)
    .order("price_cents", { ascending: true });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Subscription plans</h1>
        <p className="text-muted-foreground">
          Pick a monthly plan and manage skips or pauses inside your account.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {(plans ?? []).map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                {(plan.price_cents / 100).toFixed(2)} / {plan.interval}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Includes a curated tin pairing, brew guide, and shipping updates.
            </CardContent>
            <CardFooter>
              <SubscribeButton planId={plan.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
