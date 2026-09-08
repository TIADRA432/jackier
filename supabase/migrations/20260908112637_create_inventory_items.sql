create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  category text not null default 'Non classé' check (char_length(btrim(category)) between 1 and 80),
  unit text not null default 'unité' check (char_length(btrim(unit)) between 1 and 16),
  quantity numeric(12, 3) not null default 0 check (quantity >= 0),
  reorder_level numeric(12, 3) not null default 0 check (reorder_level >= 0),
  unit_cost numeric(14, 2) check (unit_cost is null or unit_cost >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory_items enable row level security;

create policy "Server role manages inventory"
on public.inventory_items
for all
to service_role
using (true)
with check (true);
