-- Favorieten voor ingelogde gebruikers
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_slug text not null,
  provider_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, provider_slug)
);

create index if not exists favorites_user_id_idx on public.favorites(user_id);

alter table public.favorites enable row level security;

create policy "Users manage own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Planningen verwijderen
create policy "Users delete own plans"
  on public.plans for delete
  using (auth.uid() = user_id);
