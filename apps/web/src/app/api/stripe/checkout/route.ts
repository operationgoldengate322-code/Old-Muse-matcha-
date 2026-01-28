import { NextResponse } from "next/server";

import { getOrCreateStripeCustomer } from "@/lib/stripe/customers";
import { stripe } from "@/lib/stripe/client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = (await request.json()) as { planId?: string };
  if (!planId) {
    return NextResponse.json({ error: "Plan ID required." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: plan } = await admin
    .from("plans")
    .select("id, stripe_price_id")
    .eq("id", planId)
    .single();

  if (!plan?.stripe_price_id) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const customerId = await getOrCreateStripeCustomer({
    userId: user.id,
    email: user.email,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/account?success=1`,
    cancel_url: `${siteUrl}/plans?canceled=1`,
    subscription_data: {
      metadata: { user_id: user.id, plan_id: plan.id },
    },
    metadata: { user_id: user.id, plan_id: plan.id },
  });

  return NextResponse.json({ url: session.url });
}
