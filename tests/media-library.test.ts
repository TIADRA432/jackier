import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('media library remains server-mediated, authenticated and constrained to safe image formats', async () => {
  const routes = await source('src', 'routes', 'index.ts');
  const controller = await source('src', 'controllers', 'media.controller.ts');

  assert.match(routes, /router\.post\('\/media', verifyToken, requireRole\(\['ADMIN'\]\), upload\.single\('image'\), createMediaAsset\)/);
  assert.match(routes, /router\.get\('\/media', verifyToken, requireRole\(\['ADMIN'\]\), getMediaAssets\)/);
  assert.match(controller, /validateUploadedImage\(req\)/);
  assert.match(controller, /upsert: false/);
  assert.match(controller, /cacheControl: '31536000'/);
  assert.match(controller, /MEDIA_CATEGORIES/);
  assert.match(controller, /altText is required/);
  assert.match(controller, /currently used by the site/);
});

test('media registry migration enables RLS and limits the public bucket to site image formats', async () => {
  const migration = await source('supabase', 'migrations', '20260909012613_create_media_library.sql');

  assert.match(migration, /insert into storage\.buckets/);
  assert.match(migration, /'restaurant-media'/);
  assert.match(migration, /array\['image\/jpeg', 'image\/png', 'image\/webp'\]/);
  assert.match(migration, /create table if not exists public\.media_assets/);
  assert.match(migration, /alter table public\.media_assets enable row level security/);
});
