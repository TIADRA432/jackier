import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('public catalogue RLS exposes active menu and wine content while school is fail-closed to published status', async () => {
  const baseMigration = await source('supabase', 'migrations', '20260924061000_harden_public_catalog_rls.sql');
  const schoolMigration = await source('supabase', 'migrations', '20260924090000_school_v1_sessions_registrations.sql');

  assert.match(baseMigration, /Public read active menu_items/);
  assert.match(baseMigration, /using \(active = true\)/);
  assert.match(baseMigration, /Public read active menu_categories/);
  assert.match(baseMigration, /Public read active wine_items/);

  assert.match(schoolMigration, /drop policy if exists "Public read active school_programs"/);
  assert.match(schoolMigration, /create policy "Public read published school_programs"/);
  assert.match(schoolMigration, /coalesce\(data->>'status', 'draft'\) = 'published'/);
});

test('gallery writes are server-only at the database layer', async () => {
  const migration = await source('supabase', 'migrations', '20260924061000_harden_public_catalog_rls.sql');

  assert.match(migration, /drop policy if exists "Authenticated users can delete gallery images"/);
  assert.match(migration, /drop policy if exists "Authenticated users can insert gallery images"/);
  assert.match(migration, /drop policy if exists "Authenticated users can update gallery images"/);
  assert.match(migration, /create policy "Server role manages gallery images"/);
  assert.match(migration, /to service_role/);
});
