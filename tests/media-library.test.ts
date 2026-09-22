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
  assert.match(routes, /router\.get\('\/media\/tags', verifyToken, requireRole\(\['ADMIN'\]\), getMediaTags\)/);
  assert.match(routes, /router\.post\('\/media\/tags', verifyToken, requireRole\(\['ADMIN'\]\), createMediaTag\)/);
  assert.match(routes, /router\.get\('\/media\/:id\/download', verifyToken, requireRole\(\['ADMIN'\]\), downloadMediaAsset\)/);
  assert.match(routes, /router\.get\('\/media\/:id\/usage', verifyToken, requireRole\(\['ADMIN'\]\), getMediaAssetUsage\)/);
  assert.match(controller, /validateUploadedImage\(req\)/);
  assert.match(controller, /upsert: false/);
  assert.match(controller, /cacheControl: '31536000'/);
  assert.match(controller, /MEDIA_CATEGORIES/);
  assert.match(controller, /altText is required/);
  assert.match(controller, /currently used by the site/);
  assert.match(controller, /validateTagIds/);
  assert.match(controller, /setAssetTags/);
  assert.match(controller, /Content-Disposition/);
});

test('media registry migration enables RLS and limits the public bucket to site image formats', async () => {
  const migration = await source('supabase', 'migrations', '20260909012613_create_media_library.sql');

  assert.match(migration, /insert into storage\.buckets/);
  assert.match(migration, /'restaurant-media'/);
  assert.match(migration, /array\['image\/jpeg', 'image\/png', 'image\/webp'\]/);
  assert.match(migration, /create table if not exists public\.media_assets/);
  assert.match(migration, /alter table public\.media_assets enable row level security/);
});

test('media tags use server-only RLS tables with cascading asset relationships', async () => {
  const migration = await source('supabase', 'migrations', '20260916201843_add_media_tags.sql');

  assert.match(migration, /create table if not exists public\.media_tags/);
  assert.match(migration, /create table if not exists public\.media_asset_tags/);
  assert.match(migration, /references public\.media_assets\(id\) on delete cascade/);
  assert.match(migration, /alter table public\.media_tags enable row level security/);
  assert.match(migration, /revoke all on public\.media_tags from anon, authenticated/);
});

test('admin media UI supports batch import, tags, filters and authenticated downloads', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'cms', 'cms.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');

  assert.match(component, /DashboardComponent/);
  assert.match(component, /<uppy-dashboard \[uppy\]="uppy"/);
  assert.match(component, /maxNumberOfFiles: 20/);
  assert.match(component, /allowedFileTypes: \['image\/jpeg', 'image\/png', 'image\/webp'\]/);
  assert.match(component, /uploadDrafts/);
  assert.match(component, /canUpload\(\): boolean/);
  assert.doesNotMatch(component, /readonly canUpload = computed/);
  assert.match(component, /getMediaTags\(\)/);
  assert.match(component, /createTag\(\)/);
  assert.match(component, /filteredMedia/);
  assert.match(component, /download\(item\)/);
  assert.match(component, /saveEdit\(item/);
  assert.match(component, /toggleGallery\(item/);
  assert.match(component, /copyUrl\(item/);
  assert.match(component, /inspectUsage\(item/);
  assert.match(service, /getMediaAssetUsage\(id/);
  assert.match(service, /formData\.set\('tagIds', JSON\.stringify/);
  assert.match(service, /responseType: 'blob'/);
});
