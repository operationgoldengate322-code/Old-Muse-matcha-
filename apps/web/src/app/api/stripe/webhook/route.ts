import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { renewalFailedEmail, welcomeEmail } from "@/lib/resend/templates";
import { sendTransactionalEmail } from "@/lib/resend/send";
import { stripe } from "@/lib/stripe/client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

async function upsertSubscription(
  subscription: Stripe.Subscription,
  userId: string,
  planId: string | null
) {
  const supabase = createSupabaseAdminClient();
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      plan_id: planId,
      status: subscription.status,
      current_period_end: periodEnd,
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function resolvePlanId(priceId: string | null) {
  if (!priceId) return null;
  const supabase = createSupabaseAdminClient();
  const { data: plan } = await supabase
    .from("plans")
    .select("id")
    .eq("stripe_price_id", priceId)
    .single();
  return plan?.id ?? null;
}

async function resolveUserIdByCustomer(customerId: string | null) {
  if (!customerId) return null;
  const supabase = createSupabaseAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("stripe_customer_id", customerId)
    .single();
  return profile ?? null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe] webhook signature error", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string | null;
      const customerId = session.customer as string | null;
      const userId = session.metadata?.user_id ?? null;
      const planId = session.metadata?.plan_id ?? null;

      if (subscriptionId && userId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscription(subscription, userId, planId);
      }

      const email =
        session.customer_details?.email ?? session.customer_email ?? null;
      if (email) {
        const template = welcomeEmail();
        await sendTransactionalEmail({
          to: email,
          subject: template.subject,
          html: template.html,
        });
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string | null;
      const profile = await resolveUserIdByCustomer(customerId);
      const priceId = subscription.items.data[0]?.price?.id ?? null;
      const planId = await resolvePlanId(priceId);

      if (profile?.id) {
        await upsertSubscription(subscription, profile.id, planId);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string | null;
      const profile = await resolveUserIdByCustomer(customerId);
      if (profile?.id && invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );
        await upsertSubscription(subscription, profile.id, await resolvePlanId(subscription.items.data[0]?.price?.id ?? null));
        const template = renewalFailedEmail();
        if (profile.email) {
          await sendTransactionalEmail({
            to: profile.email,
            subject: template.subject,
            html: template.html,
          });
        }
      }
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const profile = await resolveUserIdByCustomer(paymentIntent.customer as string);
      if (profile?.id) {
        await supabase.from("orders").upsert(
          {
            user_id: profile.id,
            stripe_payment_intent_id: paymentIntent.id,
            amount_cents: paymentIntent.amount_received,
            status: paymentIntent.status,
          },
          { onConflict: "stripe_payment_intent_id" }
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
