import assert from 'node:assert/strict';
import test from 'node:test';
import { validateMenuPayload } from '../src/controllers/menu.controller.ts';

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
