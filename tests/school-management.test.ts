import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('school API separates public active programmes from protected admin catalogue', async () => {
  const routes = await source('src', 'routes', 'index.ts');
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(routes, /router\.get\('\/school', getPublicSchoolPrograms\)/);
  assert.match(routes, /router\.get\('\/admin\/school', verifyToken, requireRole\(\['ADMIN'\]\), getSchoolPrograms\)/);
  assert.match(controller, /program\.active !== false/);
  assert.match(controller, /active: payload\.active \?\? true/);
});

test('school programme writes are validated and sortable', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(controller, /SCHOOL_FIELDS/);
  assert.match(controller, /validateSchoolPayload/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'school program'\)/);
  assert.match(controller, /displayOrder/);
  assert.match(controller, /Invalid active/);
});

test('school admin can create edit publish hide and delete programmes', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'school', 'school.component.ts');

  assert.match(admin, /Créer le programme/);
  assert.match(admin, /Visible sur le site public/);
  assert.match(admin, /toggleActive/);
  assert.match(admin, /deleteProgram/);
  assert.match(admin, /this\.adminData\.createSchoolProgram/);
  assert.match(admin, /this\.adminData\.updateSchoolProgram/);
  assert.match(admin, /this\.adminData\.deleteSchoolProgram/);
});

test('public school service ignores hidden programmes and sorts by order', async () => {
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(service, /filter\(item => item\.active !== false\)/);
  assert.match(service, /sort\(\(a, b\) => Number\(a\.displayOrder \?\? 0\) - Number\(b\.displayOrder \?\? 0\)\)/);
});

test('delivery readiness links missing content to the correct admin screens', async () => {
  const dashboard = await source('src', 'app', 'pages', 'admin', 'dashboard', 'dashboard.component.ts');

  assert.match(dashboard, /settings: '\/admin\/settings'/);
  assert.match(dashboard, /menu: '\/admin\/restaurant'/);
  assert.match(dashboard, /wines: '\/admin\/vins'/);
  assert.match(dashboard, /team: '\/admin\/equipe'/);
  assert.match(dashboard, /gallery: '\/admin\/galerie'/);
  assert.match(dashboard, /school: '\/admin\/ecole'/);
});
