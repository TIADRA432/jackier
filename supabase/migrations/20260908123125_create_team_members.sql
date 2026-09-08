create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  role text not null check (char_length(btrim(role)) between 1 and 120),
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

create policy "Server role manages team members"
on public.team_members
for all
to service_role
using (true)
with check (true);
