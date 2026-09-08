-- Canonical availability contract for public and administrative menu flows.
-- Existing records were published before this flag existed, so preserve their visibility.
alter table public.menu_items add column if not exists active boolean;

update public.menu_items
set active = true
where active is null;

alter table public.menu_items alter column active set default true;
alter table public.menu_items alter column active set not null;
