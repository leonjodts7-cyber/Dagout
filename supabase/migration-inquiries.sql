
-- Migratie voor bestaande databases (voer uit in Supabase SQL Editor indien tabellen al bestaan)
-- alter table public.inquiries alter column listing_id drop not null;
-- alter table public.inquiries add column if not exists provider_slug text;
-- alter table public.inquiries add column if not exists provider_name text;
-- alter table public.inquiries add column if not exists status text not null default 'new';
-- alter table public.profiles add column if not exists website text;
