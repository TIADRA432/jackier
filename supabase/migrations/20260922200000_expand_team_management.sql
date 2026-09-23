alter table if exists public.team_members
  add column if not exists department text not null default 'salle',
  add column if not exists bio text,
  add column if not exists display_order integer not null default 0,
  add column if not exists public_visible boolean not null default false;

create index if not exists team_members_public_order_idx
  on public.team_members (public_visible, active, display_order, name);

comment on column public.team_members.department is 'Operational department used for admin filtering and public presentation.';
comment on column public.team_members.public_visible is 'Controls whether an active member appears on the public About page.';
