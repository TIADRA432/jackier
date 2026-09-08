-- Covers the foreign key used when joining or filtering menu items by category.
create index if not exists menu_items_category_id_idx
on public.menu_items (category_id);
