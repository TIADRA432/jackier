import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('admin exposes a dedicated public gallery manager route and navigation entry', async () => {
  const routes = await source('src', 'app', 'app.routes.ts');
  const layout = await source('src', 'app', 'pages', 'admin', 'admin.component.ts');

  assert.match(routes, /path: 'galerie'/);
  assert.match(routes, /admin-gallery\.component/);
  assert.match(layout, /routerLink="\/admin\/galerie"/);
  assert.match(layout, /Galerie publique/);
});

test('gallery manager supports publishing, editing, unpublishing and reordering', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'gallery', 'admin-gallery.component.ts');

  assert.match(component, /Ajouter depuis la Médiathèque/);
  assert.match(component, /publishSelected\(\)/);
  assert.match(component, /saveEdit\(item/);
  assert.match(component, /unpublish\(item/);
  assert.match(component, /persistOrder/);
  assert.match(component, /dragStart/);
  assert.match(component, /dropOn/);
  assert.match(component, /move\(item, -1\)/);
  assert.match(component, /move\(item, 1\)/);
});

test('gallery manager includes public preview and category filtering', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'gallery', 'admin-gallery.component.ts');

  assert.match(component, /Aperçu du rendu public/);
  assert.match(component, /categoryFilter/);
  assert.match(component, /filteredGallery = computed/);
  assert.match(component, /routerLink="\/gallery"/);
  assert.match(component, /Restaurant/);
  assert.match(component, /Cuisine/);
  assert.match(component, /Événements/);
  assert.match(component, /École gastronomique/);
});
