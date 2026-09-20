-- Searchable tags for the global media library. Access remains server-mediated:
-- the Worker uses the service role after verifying the administrator JWT.
create table if not exists public.media_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 40),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.media_asset_tags (
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  tag_id uuid not null references public.media_tags(id) on delete cascade,
  primary key (media_asset_id, tag_id)
);

create index if not exists media_asset_tags_tag_asset_idx
  on public.media_asset_tags (tag_id, media_asset_id);

alter table public.media_tags enable row level security;
alter table public.media_asset_tags enable row level security;

revoke all on public.media_tags from anon, authenticated;
revoke all on public.media_asset_tags from anon, authenticated;
