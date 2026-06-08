alter table public.profiles
  add column if not exists plan_tier text default 'free';
