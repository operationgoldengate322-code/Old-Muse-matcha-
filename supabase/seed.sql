insert into public.plans (name, price_cents, interval, stripe_price_id, active)
values
  ('Ceremony Monthly', 4900, 'month', 'price_ceremony_monthly', true),
  ('Daily Ritual', 6900, 'month', 'price_daily_ritual', true),
  ('Cafe Duo', 9800, 'month', 'price_cafe_duo', true)
on conflict do nothing;
