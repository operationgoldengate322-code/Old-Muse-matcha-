# Koyo Club

Koyo Club is a curated matcha subscription storefront paired with a private,
owner-only sourcing hub. The public site handles marketing, subscriptions, and
account management. The owner portal manages suppliers, outreach, research, and
tasks.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Postgres + RLS + Auth (magic links)
- Stripe subscriptions + customer portal
- Resend transactional emails
- OpenAI API for research + outreach
- shadcn/ui components
- Vitest + Playwright

## Monorepo layout

```
apps/web   # Next.js application
supabase   # SQL migrations + seed
```

## Local setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Create an `.env.local` in `apps/web` using `.env.example` as a guide.

3. Run Supabase migrations + seed
   - Use the Supabase CLI or SQL editor to run:
     - `supabase/migrations/0001_init.sql`
     - `supabase/seed.sql`

4. Start the app
   ```bash
   npm run dev
   ```

## Stripe setup

- Create Stripe prices for each plan and update `supabase/seed.sql`.
- Configure webhook endpoint:
  - `POST /api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.*`,
    `invoice.payment_failed`, `payment_intent.succeeded`
- Add the webhook secret to `STRIPE_WEBHOOK_SECRET`.

## Supabase roles

- Default users are `customer`.
- Promote an owner by updating `profiles.role` to `owner`.

## Tests

```
npm run test:unit
npm run test:e2e
```
