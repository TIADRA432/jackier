import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('SEO service updates canonical social metadata and restaurant JSON-LD', async () => {
  const service = await source('src', 'app', 'core', 'services', 'seo.service.ts');

  assert.match(service, /link\[rel="canonical"\]/);
  assert.match(service, /property: 'og:title'/);
  assert.match(service, /property: 'og:description'/);
  assert.match(service, /property: 'og:url'/);
  assert.match(service, /name: 'twitter:title'/);
  assert.match(service, /application\/ld\+json/);
  assert.match(service, /'@type': 'Restaurant'/);
  assert.match(service, /OpeningHoursSpecification/);
  assert.match(service, /addressCountry: 'GN'/);
});

test('admin and not-found routes are not indexable', async () => {
  const app = await source('src', 'app.component.ts');
  const routes = await source('src', 'app', 'app.routes.ts');
  const service = await source('src', 'app', 'core', 'services', 'seo.service.ts');

  assert.match(app, /startsWith\('\/admin'\)/);
  assert.match(app, /noindex: true/);
  assert.match(routes, /Page introuvable – Le Jacquier/);
  assert.match(routes, /noindex: true/);
  assert.match(service, /noindex, nofollow/);
  assert.match(service, /existing\?\.remove\(\)/);
});

test('public routes define page-specific SEO descriptions', async () => {
  const routes = await source('src', 'app', 'app.routes.ts');

  for (const fragment of [
    'Restaurant à Kipé, Conakry',
    'Menu & Carte des vins',
    'Service Traiteur à Conakry',
    'École de Gastronomie',
    'Réserver une table',
    'Contact & Accès'
  ]) {
    assert.ok(routes.includes(fragment), `Missing SEO route fragment: ${fragment}`);
  }

  assert.match(routes, /data: \{ seo: \{ description:/);
});

test('robots and sitemap exclude admin and cover public routes', async () => {
  const robots = await source('public', 'robots.txt');
  const sitemap = await source('public', 'sitemap.xml');

  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(sitemap, /\/menu<\/loc>/);
  assert.match(sitemap, /\/reservation<\/loc>/);
  assert.match(sitemap, /\/services-traiteur<\/loc>/);
  assert.doesNotMatch(sitemap, /\/admin/);
});


test('the site uses the versioned Jacquier brand mark as favicon', async () => {
  const index = await source('index.html');
  const mark = await source('public', 'brand', 'le-jacquier-mark.svg');

  assert.match(index, /rel="icon" type="image\/svg\+xml" href="\/brand\/le-jacquier-mark\.svg"/);
  assert.match(mark, /<svg/);
  assert.doesNotMatch(index, /favicon\.ico/);
});
