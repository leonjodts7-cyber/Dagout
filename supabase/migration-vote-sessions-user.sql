-- Voeg creator_user_id toe aan vote_sessions
alter table public.vote_sessions
  add column if not exists creator_user_id uuid references auth.users(id) on delete set null;

create index if not exists vote_sessions_creator_user_id_idx
  on public.vote_sessions(creator_user_id);
