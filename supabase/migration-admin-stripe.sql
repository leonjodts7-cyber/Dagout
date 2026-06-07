-- Migratie voor bestaande databases (admin, stripe, featured listings)

alter table public.listings drop constraint if exists listings_status_check;

alter table public.listings add column if not exists rejection_reason text;

alter table public.listings add column if not exists featured boolean not null default false;

alter table public.listings add constraint listings_status_check
  check (status in ('pending', 'active', 'inactive', 'rejected'));

alter table public.profiles add column if not exists is_pro boolean default false;

alter table public.profiles add column if not exists stripe_customer_id text;

alter table public.profiles add column if not exists stripe_subscription_id text;
