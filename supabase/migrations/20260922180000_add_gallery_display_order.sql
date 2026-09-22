alter table if exists public.gallery_images
  add column if not exists display_order integer not null default 0;

with ranked as (
  select id, row_number() over (order by uploaded_at desc, id) - 1 as position
  from public.gallery_images
)
update public.gallery_images as gallery
set display_order = ranked.position
from ranked
where gallery.id = ranked.id
  and gallery.display_order = 0;

create index if not exists gallery_images_display_order_idx
  on public.gallery_images (display_order, uploaded_at desc);
