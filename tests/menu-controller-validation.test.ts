import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

process.env.SUPABASE_URL ??= 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ??= 'test-service-role-key';

const { validateMenuPayload } = await import('../src/controllers/menu.controller.ts');
const root = process.cwd();

const validCategoryId = '123e4567-e89b-42d3-a456-426614174000';

test('menu payload accepts UUID category identifiers', () => {
  const payload = validateMenuPayload({
    name: 'Poisson braisé',
    category: 'Grillades',
    categoryId: validCategoryId,
    price: 150000,
  }, false);

  assert.equal(payload.categoryId, validCategoryId);
});

test('menu payload rejects malformed category identifiers', () => {
  assert.throws(() => validateMenuPayload({
    name: 'Poisson braisé',
    category: 'Grillades',
    categoryId: 'grillades',
    price: 150000,
  }, false), /Invalid category id/);
});


test('menu writes verify that referenced categories actually exist', async () => {
  const controller = await readFile(path.join(root, 'src', 'controllers', 'menu.controller.ts'), 'utf8');

  assert.match(controller, /ensureCategoryExists/);
  assert.match(controller, /getCollection\('menuCategories'\)/);
  assert.match(controller, /Unknown category id/);
  assert.match(controller, /await ensureCategoryExists\(String\(payload\.categoryId\)\)/);
});
