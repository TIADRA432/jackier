import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('public catalogue RLS exposes only active menu wine and school content', async () => {
  const migration = await source('supabase', 'migrations', '20260924061000_harden_public_catalog_rls.sql');

  assert.match(migration, /Public read active menu_items/);
  assert.match(migration, /using \(active = true\)/);
  assert.match(migration, /Public read active menu_categories/);
  assert.match(migration, /Public read active wine_items/);
  assert.match(migration, /Public read active school_programs/);
  assert.match(migration, /coalesce\(data->>'active', 'true'\) = 'true'/);
});

test('gallery writes are server-only at the database layer', async () => {
  const migration = await source('supabase', 'migrations', '20260924061000_harden_public_catalog_rls.sql');

  assert.match(migration, /drop policy if exists "Authenticated users can delete gallery images"/);
  assert.match(migration, /drop policy if exists "Authenticated users can insert gallery images"/);
  assert.match(migration, /drop policy if exists "Authenticated users can update gallery images"/);
  assert.match(migration, /create policy "Server role manages gallery images"/);
  assert.match(migration, /to service_role/);
});
