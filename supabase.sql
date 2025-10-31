-- Supabase schema for Social Console

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  google_sub text unique,
  meta_user_id text,
  ig_user_id text,
  youtube_token jsonb,
  instagram_token jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  platform text check (platform in ('youtube','instagram')),
  data jsonb,
  created_at timestamp with time zone default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();
