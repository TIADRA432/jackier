import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('gallery API supports editorial ordering and protected updates', async () => {
  const controller = await source('src', 'controllers', 'gallery.controller.ts');
  const routes = await source('src', 'routes', 'index.ts');

  assert.match(controller, /GALLERY_CATEGORIES/);
  assert.match(controller, /display_order/);
  assert.match(controller, /order\('display_order'/);
  assert.match(controller, /updateGalleryImage/);
  assert.match(routes, /router\.put\('\/gallery\/:id', verifyToken, requireRole\(\['ADMIN'\]\), updateGalleryImage\)/);
});

test('public gallery provides category filters and an accessible lightbox', async () => {
  const component = await source('src', 'app', 'pages', 'gallery', 'gallery.component.ts');

  assert.match(component, /activeCategory = signal/);
  assert.match(component, /filteredImages = computed/);
  assert.match(component, /openLightbox/);
  assert.match(component, /previousImage/);
  assert.match(component, /nextImage/);
  assert.match(component, /HostListener\('document:keydown'/);
  assert.match(component, /aria-modal="true"/);
});

test('gallery display order migration is additive and indexed', async () => {
  const migration = await source('supabase', 'migrations', '20260922180000_add_gallery_display_order.sql');

  assert.match(migration, /add column if not exists display_order integer not null default 0/);
  assert.match(migration, /row_number\(\) over \(order by uploaded_at desc, id\)/);
  assert.match(migration, /gallery_images_display_order_idx/);
});
