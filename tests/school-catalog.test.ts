import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('school catalogue separates public programs from protected admin drafts', async () => {
  const routes = await source('src', 'routes', 'index.ts');
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(routes, /router\.get\('\/school', getPublicSchoolPrograms\)/);
  assert.match(routes, /router\.get\('\/admin\/school', verifyToken, requireRole\(\['ADMIN'\]\), getSchoolPrograms\)/);
  assert.match(controller, /filter\(\(program: any\) => program\.active !== false\)/);
  assert.match(controller, /active: payload\.active \?\? true/);
});

test('school writes whitelist validated editorial fields and resource ids', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(controller, /SCHOOL_FIELDS/);
  assert.match(controller, /requireKnownFields/);
  assert.match(controller, /requiredText\(source\.title/);
  assert.match(controller, /optionalOrder/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'school program'\)/);
});

test('admin school screen supports draft publication and CRUD', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'school', 'school.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');

  assert.match(service, /get<SchoolProgram\[\]>\(`\$\{this\.apiUrl\}\/admin\/school`\)/);
  assert.match(component, /Créer un programme/);
  assert.match(component, /Visible sur le site public/);
  assert.match(component, /toggleActive/);
  assert.match(component, /createSchoolProgram/);
  assert.match(component, /updateSchoolProgram/);
  assert.match(component, /deleteSchoolProgram/);
});

test('public school page remains truthful when no program is published', async () => {
  const page = await source('src', 'app', 'pages', 'school', 'school.component.ts');

  assert.match(page, /Le prochain programme sera annoncé ici/);
  assert.match(page, /contactez directement Le Jacquier/);
  assert.doesNotMatch(page, /programmes en brouillon/);
  assert.doesNotMatch(page, /étudiants inscrits/i);
  assert.doesNotMatch(page, /certification reconnue/i);
});
