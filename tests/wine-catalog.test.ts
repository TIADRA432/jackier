import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('wine API separates public active catalogue from protected admin catalogue', async () => {
  const routes = await source('src', 'routes', 'index.ts');
  const controller = await source('src', 'controllers', 'wine.controller.ts');

  assert.match(routes, /router\.get\('\/wines', getPublicWines\)/);
  assert.match(routes, /router\.get\('\/admin\/wines', verifyToken, requireRole\(\['ADMIN'\]\), getWines\)/);
  assert.match(controller, /filter\(\(wine: any\) => wine\.active !== false\)/);
  assert.match(controller, /active: payload\.active \?\? true/);
});

test('wine catalogue supports real metadata and visibility', async () => {
  const controller = await source('src', 'controllers', 'wine.controller.ts');
  const adminService = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const model = await source('src', 'app', 'core', 'models', 'index.ts');

  for (const field of ['origin', 'grape', 'year', 'active']) {
    assert.match(controller, new RegExp(field));
    assert.match(adminService, new RegExp(field));
  }
  assert.match(model, /origin\?: string/);
  assert.match(model, /grape\?: string/);
  assert.match(model, /year\?: number/);
});

test('optional wine metadata can be cleared', async () => {
  const controller = await source('src', 'controllers', 'wine.controller.ts');

  assert.match(controller, /optionalNullableText/);
  assert.match(controller, /value === null \|\| value === ''/);
  assert.match(controller, /optionalNullableImageUrl/);
});

test('admin wine editor manages origin grape year and public visibility', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'wines', 'wines.component.ts');

  assert.match(admin, />Origine</);
  assert.match(admin, />Cépage</);
  assert.match(admin, />Année</);
  assert.match(admin, /Visible sur la carte publique/);
  assert.match(admin, /wine\.active !== false \? 'Public' : 'Masqué'/);
});

test('public menu renders wine selection only when there is content or loading state', async () => {
  const menu = await source('src', 'app', 'pages', 'menu', 'menu.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(menu, /Carte des vins/);
  assert.match(menu, /wines\(\)\.length \|\| isLoadingWines\(\) \|\| wineError\(\)/);
  assert.match(menu, /wine\.origin/);
  assert.match(menu, /wine\.grape/);
  assert.match(menu, /wine\.year/);
  assert.match(service, /retryLoadWines/);
});
