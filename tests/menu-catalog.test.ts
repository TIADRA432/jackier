import assert from 'node:assert/strict';
import test from 'node:test';
import { categoryFilters, filterDishes, type MenuFilters } from '../src/app/core/models/menu-catalog.ts';
import type { Dish } from '../src/app/core/models/index.ts';

const dishes: Dish[] = [
  { id: '1', name: 'Légumes braisés', description: 'Épices maison', price: 50000, category: 'ancien nom', categoryId: 'grill', image: '', isVegetarian: true, isFeatured: true },
  { id: '2', name: 'Poisson', description: 'Grillé', price: 1500000, category: 'plat', image: '', isSpicy: true },
  { id: '3', name: 'Riz', description: 'Nature', price: 0, category: 'Accompagnements', image: '' }
];
const categories = [{ id: 'side', name: 'Accompagnements', order: 2 }, { id: 'grill', name: 'Grillades', order: 1 }];
const defaults: MenuFilters = { query: '', category: 'all', vegetarian: false, spicy: false, local: false, featured: false, minPrice: 0, maxPrice: 1500000 };

test('uses managed category names and order while retaining uncategorized legacy dishes', () => {
  assert.deepEqual(categoryFilters(dishes, categories), [
    { id: 'all', label: 'Tout' }, { id: 'category:grill', label: 'Grillades' },
    { id: 'category:side', label: 'Accompagnements' }, { id: 'legacy:plat', label: 'Plats' }
  ]);
  assert.equal(categoryFilters(dishes, []).length, 4);
});
test('combines accent-insensitive search, managed category and editorial filters', () => {
  assert.deepEqual(filterDishes(dishes, categories, { ...defaults, query: '  EPICES ', category: 'category:grill', vegetarian: true, featured: true }).map(d => d.id), ['1']);
  assert.deepEqual(filterDishes(dishes, categories, { ...defaults, vegetarian: true, spicy: true }), []);
});
test('includes zero and high prices and applies inclusive budget limits', () => {
  assert.equal(filterDishes(dishes, categories, defaults).length, 3);
  assert.deepEqual(filterDishes(dishes, categories, { ...defaults, minPrice: 50000, maxPrice: 50000 }).map(d => d.id), ['1']);
});
test('does not manufacture suggestions or categories for an empty catalogue', () => {
  assert.deepEqual(categoryFilters([], categories), [{ id: 'all', label: 'Tout' }]);
  assert.deepEqual(filterDishes(dishes.slice(1), categories, { ...defaults, featured: true }), []);
});
