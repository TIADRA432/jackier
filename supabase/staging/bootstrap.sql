-- Free staging bootstrap for Le Jacquier.
-- Schema only: never copy production customer data into staging.
create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  "order" integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id),
  name text not null,
  short_description text,
  price numeric,
  image_url text,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.wine_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text,
  grape text,
  year integer,
  description text,
  price_bottle numeric,
  price_glass numeric,
  image_url text,
  display_order integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  status text default 'pending',
  date timestamptz,
  created_at timestamptz default now(),
  data jsonb default '{}'::jsonb
);

create table if not exists public.catering_events (
  id uuid primary key default gen_random_uuid(),
  status text default 'pending',
  created_at timestamptz default now(),
  data jsonb default '{}'::jsonb
);

create table if not exists public.school_programs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  data jsonb default '{}'::jsonb
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric default 0,
  date timestamptz default now(),
  created_at timestamptz default now(),
  data jsonb default '{}'::jsonb
);

create table if not exists public.finance_reports (
  id uuid primary key default gen_random_uuid(),
  date timestamptz default now(),
  created_at timestamptz default now(),
  total_revenue numeric default 0,
  total_expenses numeric default 0,
  net_income numeric default 0,
  manual_revenue numeric default 0
);

create table if not exists public.settings (
  id text primary key default 'global',
  data jsonb default '{}'::jsonb
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  action text,
  details text,
  user_id text,
  timestamp timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'USER',
  created_at timestamptz default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null default '',
  category text not null default 'gallery',
  uploaded_at timestamptz not null default now()
);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.wine_items enable row level security;
alter table public.reservations enable row level security;
alter table public.catering_events enable row level security;
alter table public.school_programs enable row level security;
alter table public.expenses enable row level security;
alter table public.finance_reports enable row level security;
alter table public.settings enable row level security;
alter table public.logs enable row level security;
alter table public.profiles enable row level security;
alter table public.gallery_images enable row level security;

create policy "Public read menu_categories" on public.menu_categories for select to public using (true);
create policy "Public read menu_items" on public.menu_items for select to public using (true);
create policy "Public read wine_items" on public.wine_items for select to public using (true);
create policy "Public read school_programs" on public.school_programs for select to public using (true);
create policy "Public can read gallery images" on public.gallery_images for select to public using (true);

create policy "Server role manages reservations" on public.reservations for all to service_role using (true) with check (true);
create policy "Server role manages catering" on public.catering_events for all to service_role using (true) with check (true);
create policy "Server role manages school programs" on public.school_programs for all to service_role using (true) with check (true);
create policy "Server role manages expenses" on public.expenses for all to service_role using (true) with check (true);
create policy "Server role manages finance reports" on public.finance_reports for all to service_role using (true) with check (true);
create policy "Server role manages settings" on public.settings for all to service_role using (true) with check (true);
create policy "Server role manages logs" on public.logs for all to service_role using (true) with check (true);

create policy "Users read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Authenticated users can insert gallery images"
on public.gallery_images for insert to authenticated with check (true);
create policy "Authenticated users can update gallery images"
on public.gallery_images for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete gallery images"
on public.gallery_images for delete to authenticated using (true);
