-- École Gastronomique V1: structured programs, sessions and registrations.
-- Public writes still go through the API using the server service role.

update public.school_programs
set data = jsonb_set(
  data,
  '{status}',
  to_jsonb(
    case
      when coalesce(data->>'active', 'false') = 'true' then 'published'
      else 'draft'
    end
  ),
  true
)
where not (data ? 'status');

drop policy if exists "Public read active school_programs" on public.school_programs;
drop policy if exists "Public read published school_programs" on public.school_programs;
create policy "Public read published school_programs"
on public.school_programs
for select
to public
using (coalesce(data->>'status', 'draft') = 'published');

drop policy if exists "Server role manages school programs" on public.school_programs;
create policy "Server role manages school programs"
on public.school_programs
for all
to service_role
using (true)
with check (true);

create table if not exists public.school_sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.school_programs(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity between 1 and 500),
  location text check (location is null or char_length(btrim(location)) between 1 and 180),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create unique index if not exists school_sessions_program_start_uidx
  on public.school_sessions(program_id, starts_at);
create index if not exists school_sessions_upcoming_idx
  on public.school_sessions(status, starts_at);

alter table public.school_sessions enable row level security;

drop policy if exists "Public read upcoming school sessions" on public.school_sessions;
create policy "Public read upcoming school sessions"
on public.school_sessions
for select
to public
using (
  status = 'scheduled'
  and starts_at >= now()
  and exists (
    select 1
    from public.school_programs p
    where p.id = school_sessions.program_id
      and coalesce(p.data->>'status', 'draft') = 'published'
  )
);

drop policy if exists "Server role manages school sessions" on public.school_sessions;
create policy "Server role manages school sessions"
on public.school_sessions
for all
to service_role
using (true)
with check (true);

create table if not exists public.school_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.school_sessions(id) on delete restrict,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 160),
  email text not null check (char_length(btrim(email)) between 5 and 254),
  phone text not null check (char_length(btrim(phone)) between 6 and 32),
  notes text check (notes is null or char_length(notes) <= 1200),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'paid', 'cancelled')),
  price_snapshot numeric(14,2) check (price_snapshot is null or price_snapshot >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists school_registration_session_email_active_uidx
  on public.school_registrations(session_id, lower(email))
  where status <> 'cancelled';
create index if not exists school_registrations_session_status_idx
  on public.school_registrations(session_id, status, created_at desc);

alter table public.school_registrations enable row level security;

drop policy if exists "Server role manages school registrations" on public.school_registrations;
create policy "Server role manages school registrations"
on public.school_registrations
for all
to service_role
using (true)
with check (true);

comment on table public.school_sessions is 'Scheduled training sessions for published school programs.';
comment on table public.school_registrations is 'Private participant registrations managed through the server API.';
