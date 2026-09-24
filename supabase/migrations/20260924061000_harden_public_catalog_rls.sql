-- Harden direct Supabase access so public visibility matches the application API.
-- Admin writes are performed by the server with the service role after role checks.

-- Menu items: do not expose inactive dishes through PostgREST.
drop policy if exists "Public read menu_items" on public.menu_items;
drop policy if exists "Public read active menu_items" on public.menu_items;
create policy "Public read active menu_items"
on public.menu_items
for select
to public
using (active = true);

-- Menu categories: keep inactive/archived categories private.
drop policy if exists "Public read menu_categories" on public.menu_categories;
drop policy if exists "Public read active menu_categories" on public.menu_categories;
create policy "Public read active menu_categories"
on public.menu_categories
for select
to public
using (active = true);

-- Wines: public catalogue exposes only active entries.
drop policy if exists "Public read wine_items" on public.wine_items;
drop policy if exists "Public read active wine_items" on public.wine_items;
create policy "Public read active wine_items"
on public.wine_items
for select
to public
using (active = true);

-- School programs are stored in JSONB. Missing active flag keeps legacy rows visible;
-- an explicit false value marks a draft/private program.
drop policy if exists "Public read school_programs" on public.school_programs;
drop policy if exists "Public read active school_programs" on public.school_programs;
create policy "Public read active school_programs"
on public.school_programs
for select
to public
using (coalesce(data->>'active', 'true') = 'true');

-- Gallery mutations must go through the authenticated admin API, not directly from
-- any Supabase authenticated account.
drop policy if exists "Authenticated users can delete gallery images" on public.gallery_images;
drop policy if exists "Authenticated users can insert gallery images" on public.gallery_images;
drop policy if exists "Authenticated users can update gallery images" on public.gallery_images;

drop policy if exists "Server role manages gallery images" on public.gallery_images;
create policy "Server role manages gallery images"
on public.gallery_images
for all
to service_role
using (true)
with check (true);
