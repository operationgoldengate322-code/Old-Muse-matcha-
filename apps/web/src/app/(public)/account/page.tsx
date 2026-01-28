import { signInWithMagicLink, signOut } from "@/lib/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { ManageBillingButton } from "@/components/manage-billing-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use your email to receive a magic link.{" "}
              {searchParams?.next ? "We will return you after sign-in." : null}
            </p>
            <form action={signInWithMagicLink} className="space-y-3">
              <Input name="email" type="email" placeholder="you@domain.com" />
              <Button type="submit" className="w-full">
                Send magic link
              </Button>
            </form>
            {searchParams?.error ? (
              <p className="text-sm text-destructive">{searchParams.error}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select(
      "id, status, current_period_end, plan:plans(name, interval, price_cents)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .maybeSingle();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {subscription ? (
            <>
              <p className="text-foreground">
                {subscription.plan?.name} ·{" "}
                {(subscription.plan?.price_cents ?? 0) / 100} /{" "}
                {subscription.plan?.interval}
              </p>
              <p>Status: {subscription.status}</p>
              {subscription.current_period_end ? (
                <p>
                  Renews on{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              ) : null}
              <ManageBillingButton />
            </>
          ) : (
            <p>No active subscription yet. Choose a plan to get started.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
