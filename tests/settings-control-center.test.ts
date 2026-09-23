import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('settings API accepts richer public configuration with safe social URLs', async () => {
  const controller = await source('src', 'controllers', 'settings.controller.ts');

  assert.match(controller, /'tagline'/);
  assert.match(controller, /'neighborhood'/);
  assert.match(controller, /'mapQuery'/);
  assert.match(controller, /SOCIAL_MEDIA_KEYS/);
  assert.match(controller, /new URL\(url\)/);
  assert.match(controller, /\['http:', 'https:'\]/);
});

test('site settings service is the public source of truth with safe fallbacks', async () => {
  const service = await source('src', 'app', 'core', 'services', 'site-settings.service.ts');

  assert.match(service, /DEFAULT_SETTINGS/);
  assert.match(service, /publicInfo = computed/);
  assert.match(service, /mapQuery/);
  assert.match(service, /socialUrl/);
  assert.match(service, /loading = signal/);
});

test('contact page reads public settings and derives its map from mapQuery', async () => {
  const component = await source('src', 'app', 'pages', 'contact', 'contact.component.ts');

  assert.match(component, /SiteSettingsService/);
  assert.match(component, /publicInfo/);
  assert.match(component, /encodeURIComponent\(this\.info\(\)\.mapQuery\)/);
  assert.match(component, /info\(\)\.phone/);
  assert.match(component, /info\(\)\.openingHours/);
  assert.doesNotMatch(component, /RestaurantService/);
});

test('footer uses configured identity contact and social links', async () => {
  const component = await source('src', 'app', 'shared', 'components', 'footer', 'footer.component.ts');

  assert.match(component, /SiteSettingsService/);
  assert.match(component, /publicInfo/);
  assert.match(component, /socialUrl\('facebook'\)/);
  assert.match(component, /socialUrl\('instagram'\)/);
  assert.match(component, /socialUrl\('whatsapp'\)/);
  assert.match(component, /info\(\)\.restaurantName/);
  assert.doesNotMatch(component, /RestaurantService/);
});

test('home hero identity comes from public settings', async () => {
  const component = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(component, /siteSettings\.publicInfo\(\)\.restaurantName/);
  assert.match(component, /siteSettings\.publicInfo\(\)\.tagline/);
});

test('admin settings acts as a control center with dirty state and previews', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(component, /Configuration globale/);
  assert.match(component, /Aperçu public/);
  assert.match(component, /Modifications non enregistrées/);
  assert.match(component, /dirty = signal/);
  assert.match(component, /discardChanges\(\)/);
  assert.match(component, /configuredHeroCount\(\)/);
  assert.match(component, /Réseaux sociaux/);
  assert.match(component, /Images de couverture/);
  assert.match(component, /brand: brand \?\? \{ siteMedia: \{\} \}/);
});
