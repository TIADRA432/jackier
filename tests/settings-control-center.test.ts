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


test('configured currency is reused across public pricing surfaces', async () => {
  const menu = await source('src', 'app', 'pages', 'menu', 'menu.component.ts');
  const card = await source('src', 'app', 'shared', 'components', 'dish-card', 'dish-card.component.ts');
  const detail = await source('src', 'app', 'shared', 'components', 'dish-card', 'dish-detail.component.ts');
  const daily = await source('src', 'app', 'shared', 'components', 'daily-special', 'daily-special.component.ts');
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');
  const cateringForm = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');

  for (const component of [menu, card, detail, daily, home, cateringForm]) {
    assert.match(component, /publicInfo\(\)\.currency/);
  }
  assert.doesNotMatch(menu, /> GNF</);
  assert.doesNotMatch(card, /> GNF</);
  assert.doesNotMatch(detail, /> GNF</);
  assert.doesNotMatch(daily, /> FG</);
});

test('catering CTA uses configured restaurant identity and phone', async () => {
  const catering = await source('src', 'app', 'pages', 'catering', 'catering.component.ts');

  assert.match(catering, /publicInfo\(\)\.restaurantName/);
  assert.match(catering, /publicInfo\(\)\.phone/);
  assert.match(catering, /phoneHref\(\)/);
  assert.doesNotMatch(catering, /tel:\+224625675363/);
});

test('optional global settings can be intentionally cleared', async () => {
  const controller = await source('src', 'controllers', 'settings.controller.ts');

  assert.match(controller, /optionalSettingsText/);
  assert.match(controller, /return result;/);
});


test('legal links are configurable validated and never rendered as placeholders', async () => {
  const controller = await source('src', 'controllers', 'settings.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');
  const footer = await source('src', 'app', 'shared', 'components', 'footer', 'footer.component.ts');

  assert.match(service, /legalNoticeUrl\?: string/);
  assert.match(service, /privacyPolicyUrl\?: string/);
  assert.match(controller, /'legalNoticeUrl'/);
  assert.match(controller, /'privacyPolicyUrl'/);
  assert.match(controller, /new URL\(value\)/);
  assert.match(settings, /Liens légaux & conformité/);
  assert.match(footer, /info\(\)\.legalNoticeUrl/);
  assert.match(footer, /info\(\)\.privacyPolicyUrl/);
  assert.doesNotMatch(footer, /href="#".*Mentions légales/);
  assert.doesNotMatch(footer, /href="#".*Politique de confidentialité/);
});

test('admin settings provides a live map preview and test link', async () => {
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(settings, /Aperçu localisation/);
  assert.match(settings, /mapPreviewUrl\(\)/);
  assert.match(settings, /mapsSearchUrl\(\)/);
  assert.match(settings, /DomSanitizer/);
  assert.match(settings, /maps\.google\.com\/maps\?q=/);
});
