import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('school catalogue separates published programs from protected admin drafts', async () => {
  const routes = await source('src', 'routes', 'index.ts');
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(routes, /router\.get\('\/school', getPublicSchoolPrograms\)/);
  assert.match(routes, /router\.get\('\/admin\/school', verifyToken, requireRole\(\['ADMIN'\]\), getSchoolPrograms\)/);
  assert.match(controller, /PROGRAM_STATUSES/);
  assert.match(controller, /=== 'published'/);
  assert.match(controller, /active: status === 'published'/);
});

test('school programme writes whitelist and sanitize structured business fields', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(controller, /PROGRAM_FIELDS/);
  assert.match(controller, /requireKnownFields/);
  assert.match(controller, /cleanText/);
  assert.match(controller, /cleanText\(source\.level, 'level', 120, true\)/);
  assert.match(controller, /materialsIncluded/);
  assert.doesNotMatch(controller, /PROGRAM_LEVELS/);
  assert.match(controller, /prerequisites/);
  assert.match(controller, /instructor/);
  assert.match(controller, /price/);
  assert.match(controller, /capacity/);
  assert.match(controller, /optionalOrder/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'school program'\)/);
  assert.match(controller, /javascript\|data/);
  assert.match(controller, /SYSTEM_TEXT_PATTERN/);
  assert.match(controller, /npm\\s\+err!/);
  assert.match(controller, /traceback/);
  assert.match(controller, /git\\s\+\(\?:status/);
});

test('public school page exposes upcoming sessions capacity and a truthful registration flow', async () => {
  const page = await source('src', 'app', 'pages', 'school', 'school.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(service, /\/school\/sessions/);
  assert.match(service, /\/school\/registrations/);
  assert.match(page, /place\(s\) restante\(s\)/);
  assert.match(page, /Demander une place/);
  assert.match(page, /statut <strong>En attente<\/strong>/);
  assert.match(page, /Aucun paiement en ligne ni e-mail automatique n’est activé/);
  assert.match(page, /submitSchoolRegistration/);
});

test('public school page remains truthful when no program is published', async () => {
  const page = await source('src', 'app', 'pages', 'school', 'school.component.ts');

  assert.match(page, /Le prochain programme sera annoncé ici/);
  assert.match(page, /contactez directement Le Jacquier/);
  assert.doesNotMatch(page, /certification reconnue/i);
  assert.doesNotMatch(page, /paiement sécurisé/i);
});
