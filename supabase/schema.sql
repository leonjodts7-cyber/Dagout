-- Dagout.be Supabase schema
-- Voer dit uit in de Supabase SQL Editor

-- Extensies
create extension if not exists "uuid-ossp";

-- Listings (aanbieder activiteiten)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null,
  short_description varchar(150) not null,
  full_description text,
  indoor_outdoor text not null check (indoor_outdoor in ('indoor', 'outdoor', 'both')),
  company_name text,
  street_address text,
  city text,
  postal_code text,
  region text,
  website text,
  phone text,
  contact_email text,
  min_persons integer,
  max_persons integer,
  duration text,
  price_from numeric(10, 2),
  price_on_request boolean default false,
  video_url text,
  certificates text,
  languages text[] default '{}',
  image_urls text[] default '{}',
  status text not null default 'pending' check (status in ('pending', 'active', 'inactive', 'rejected')),
  rejection_reason text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_user_id_idx on public.listings(user_id);
create index if not exists listings_status_idx on public.listings(status);

-- Opening hours
create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_closed boolean not null default false,
  time_from time,
  time_to time,
  unique (listing_id, day_of_week)
);

create index if not exists opening_hours_listing_id_idx on public.opening_hours(listing_id);

-- Wat is inbegrepen
create table if not exists public.listing_includes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  item text not null,
  sort_order integer not null default 0
);

create index if not exists listing_includes_listing_id_idx on public.listing_includes(listing_id);

-- Tags
create table if not exists public.listing_tags (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  tag text not null,
  unique (listing_id, tag)
);

create index if not exists listing_tags_listing_id_idx on public.listing_tags(listing_id);

-- Aanvragen van bedrijven
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  provider_slug text,
  provider_name text,
  company_name text,
  contact_name text,
  email text not null,
  phone text,
  group_size integer,
  preferred_date date,
  message text,
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_listing_id_idx on public.inquiries(listing_id);

-- Team stemmen
create table if not exists public.vote_sessions (
  id text primary key,
  creator_name text,
  company_name text,
  message text,
  deadline date,
  provider_ids text[] not null default '{}',
  creator_user_id uuid references auth.users(id) on delete set null,
  closed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references public.vote_sessions(id) on delete cascade,
  provider_id text not null,
  voter_name text not null,
  created_at timestamptz not null default now(),
  unique (session_id, voter_name)
);

create index if not exists votes_session_id_idx on public.votes(session_id);

-- AI dagplanningen
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  group_size integer,
  items jsonb not null default '[]',
  total_budget numeric(10, 2),
  created_at timestamptz not null default now()
);

create index if not exists plans_user_id_idx on public.plans(user_id);

-- Profielen (optioneel, voor dashboard)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  company_name text,
  phone text,
  website text,
  is_provider boolean default false,
  plan_tier text default 'free',
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz default now()
);

-- Storage bucket voor listing afbeeldingen
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- RLS inschakelen
alter table public.listings enable row level security;
alter table public.opening_hours enable row level security;
alter table public.listing_includes enable row level security;
alter table public.listing_tags enable row level security;
alter table public.inquiries enable row level security;
alter table public.profiles enable row level security;
alter table public.vote_sessions enable row level security;
alter table public.votes enable row level security;
alter table public.plans enable row level security;

-- Listings policies
create policy "Public can view active listings"
  on public.listings for select
  using (status = 'active');

create policy "Users can view own listings"
  on public.listings for select
  using (auth.uid() = user_id);

create policy "Users can insert own listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.listings for update
  using (auth.uid() = user_id);

-- Opening hours policies
create policy "Users manage own opening hours"
  on public.opening_hours for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

-- Includes policies
create policy "Users manage own includes"
  on public.listing_includes for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

-- Tags policies
create policy "Users manage own tags"
  on public.listing_tags for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

-- Inquiries: providers see inquiries for their listings
create policy "Providers view inquiries for own listings"
  on public.inquiries for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

create policy "Anyone can create inquiry"
  on public.inquiries for insert
  with check (true);

create policy "Providers update inquiries for own listings"
  on public.inquiries for update
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = auth.uid()
    )
  );

create policy "Users can delete own listings"
  on public.listings for delete
  using (auth.uid() = user_id);

-- Vote sessions
create policy "Anyone can create vote session"
  on public.vote_sessions for insert
  with check (true);

create policy "Anyone can read vote sessions"
  on public.vote_sessions for select
  using (true);

create policy "Anyone can update vote sessions"
  on public.vote_sessions for update
  using (true);

-- Votes
create policy "Anyone can create vote"
  on public.votes for insert
  with check (true);

create policy "Anyone can read votes"
  on public.votes for select
  using (true);

-- Plans
create policy "Anyone can create plan"
  on public.plans for insert
  with check (true);

create policy "Users read own plans"
  on public.plans for select
  using (user_id is null or auth.uid() = user_id);

-- Admin/service: listings lezen voor admin gebeurt via service role key in API routes

-- Profiles policies
create policy "Users view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Storage policies
create policy "Public read listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Authenticated users upload listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

create policy "Users delete own listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();
