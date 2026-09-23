import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('today experience is part of validated public settings', async () => {
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const controller = await source('src', 'controllers', 'settings.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'site-settings.service.ts');

  assert.match(model, /export interface TodaySettings/);
  assert.match(model, /featuredDishId\?: string/);
  assert.match(controller, /TODAY_FIELDS/);
  assert.match(controller, /TODAY_CTA_PATHS/);
  assert.match(controller, /validateToday/);
  assert.match(service, /readonly today = computed/);
});

test('admin can publish and preview today at Le Jacquier', async () => {
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(settings, /Aujourd’hui au Jacquier/);
  assert.match(settings, /Expérience vivante/);
  assert.match(settings, /patchToday/);
  assert.match(settings, /featuredDishId/);
  assert.match(settings, /selectedTodayDish/);
  assert.match(settings, /Afficher sur l’Accueil/);
  assert.match(settings, /getMenuItems\(\)/);
});

test('homepage renders today experience only when enabled', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /siteSettings\.today\(\)\.enabled/);
  assert.match(home, /todayDish = computed/);
  assert.match(home, /siteSettings\.today\(\)\.ctaPath/);
  assert.match(home, /À découvrir aujourd’hui/);
  assert.match(home, /appRevealOnScroll/);
});

test('mobile visitor actions are mounted globally but hidden from admin', async () => {
  const rootComponent = await source('src', 'app.component.ts');
  const rootTemplate = await source('src', 'app.component.html');
  const actionBar = await source('src', 'app', 'shared', 'components', 'visitor-action-bar', 'visitor-action-bar.component.ts');

  assert.match(rootComponent, /VisitorActionBarComponent/);
  assert.match(rootTemplate, /app-visitor-action-bar/);
  assert.match(actionBar, /startsWith\('\/admin'\)/);
  assert.match(actionBar, /socialUrl\('whatsapp'\)/);
  assert.match(actionBar, /phoneHref\(\)/);
  assert.match(actionBar, /startsWith\('\/reservation'\)/);
});

test('scroll reveal respects reduced motion and SSR', async () => {
  const directive = await source('src', 'app', 'shared', 'directives', 'reveal-on-scroll.directive.ts');

  assert.match(directive, /isPlatformBrowser/);
  assert.match(directive, /prefers-reduced-motion: reduce/);
  assert.match(directive, /IntersectionObserver/);
  assert.match(directive, /ngOnDestroy/);
});


test('homepage only exposes real managed restaurant content', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(home, /galleryHighlights/);
  assert.match(home, /schoolHighlights/);
  assert.match(home, /teamHighlights/);
  assert.match(home, /Suggestion de la Cheffe/);
  assert.match(home, /Le restaurant en images/);
  assert.match(home, /École de Gastronomie/);

  assert.doesNotMatch(home, /Guide Gastronomique 2023/);
  assert.doesNotMatch(home, /Meilleur Restaurant Conakry/);
  assert.doesNotMatch(home, /Prix d'Excellence Culinaire/);
  assert.doesNotMatch(home, />2010</);
  assert.doesNotMatch(home, />2015</);

  assert.doesNotMatch(service, /Mariam C\./);
  assert.doesNotMatch(service, /Jean-Pierre L\./);
  assert.doesNotMatch(service, /Fatim D\./);
  assert.doesNotMatch(service, /list\[Math\.min\(2/);
  assert.match(service, /find\(dish => dish\.isFeatured === true\)/);
});


test('homepage live visuals degrade gracefully when media is missing', async () => {
  const home = await source('src', 'app', 'pages', 'home', 'home.component.ts');

  assert.match(home, /cuisineVisual = computed/);
  assert.match(home, /ambianceVisual = computed/);
  assert.match(home, /image\.category === 'cuisine'/);
  assert.match(home, /image\.category === 'ambiance'/);
  assert.match(home, /À découvrir au Jacquier/);
  assert.match(home, /@if \(dish\.image\)/);
});
