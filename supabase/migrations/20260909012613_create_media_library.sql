-- Central registry for public site imagery. Binary data belongs in Storage;
-- this table is only the searchable, auditable catalogue of those files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-media',
  'restaurant-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'restaurant-media' check (bucket_id = 'restaurant-media'),
  path text not null unique,
  public_url text not null unique,
  original_name text not null check (char_length(original_name) between 1 and 255),
  title text not null default '' check (char_length(title) <= 200),
  alt_text text not null check (char_length(alt_text) between 1 and 200),
  category text not null check (category in ('branding', 'hero', 'menu', 'wines', 'gallery', 'team')),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 5242880),
  created_at timestamptz not null default now()
);

create index if not exists media_assets_category_created_at_idx
  on public.media_assets (category, created_at desc);

-- The Data API must expose no media catalogue rows directly. The Worker uses the
-- server-only service key; all browser writes go through its authenticated API.
alter table public.media_assets enable row level security;
