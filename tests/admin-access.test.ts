import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('the admin route is protected and the login route stays public', async () => {
  const routes = await source('src', 'app', 'app.routes.ts');

  assert.match(routes, /path: 'admin\/login'[\s\S]*?AdminLoginComponent/);
  assert.match(routes, /path: 'admin',[\s\S]*?canActivate: \[adminAuthGuard\],[\s\S]*?canActivateChild: \[adminAuthGuard\]/);
});

test('admin authorization is role-based and fails closed', async () => {
  const auth = await source('src', 'app', 'core', 'services', 'admin-auth.service.ts');

  assert.match(auth, /supabaseClient\.auth\.getUser\(\)/);
  assert.match(auth, /from\('profiles'\)/);
  assert.match(auth, /profile\?\.role === 'ADMIN'/);
  assert.doesNotMatch(auth, /user\.user_metadata/);
});

test('only first-party API requests receive the bearer token', async () => {
  const interceptor = await source('src', 'app', 'core', 'interceptors', 'auth.interceptor.ts');

  assert.match(interceptor, /request\.url\.startsWith\('\/api\/'\)/);
  assert.match(interceptor, /Authorization: `Bearer \$\{accessToken\}`/);
});

test('the reservations screen uses protected API data and persists only allowed status changes', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(service, /get<AdminReservation\[\]>\(`\$\{this\.apiUrl\}\/reservations`\)/);
  assert.match(service, /put<AdminReservation>\(`\$\{this\.apiUrl\}\/reservations\/\$\{id\}\/status`, \{ status \}\)/);
  assert.match(component, /this\.adminData\.getReservations\(\)/);
  assert.match(component, /this\.adminData\.updateReservationStatus/);
  assert.match(component, /this\.statuses\.includes/);
});

test('the dashboard reads its operational metrics from the protected overview endpoint', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'dashboard', 'dashboard.component.ts');

  assert.match(service, /get<DashboardOverview>\(`\$\{this\.apiUrl\}\/dashboard\/overview`\)/);
  assert.match(component, /this\.adminData\.getDashboardOverview\(\)/);
  assert.match(component, /Aucun rapport financier disponible/);
});

test('the catering screen reads and updates only the protected catering API', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(service, /get<CateringEvent\[\]>\(`\$\{this\.apiUrl\}\/catering`\)/);
  assert.match(service, /put<CateringEvent>\(`\$\{this\.apiUrl\}\/catering\/\$\{id\}`, \{ status \}\)/);
  assert.match(component, /this\.adminData\.getCateringEvents\(\)/);
  assert.match(component, /this\.adminData\.updateCateringStatus/);
});

test('the school screen displays real programs instead of fictitious students', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'school', 'school.component.ts');

  assert.match(service, /get<SchoolProgram\[\]>\(`\$\{this\.apiUrl\}\/school`\)/);
  assert.match(component, /this\.adminData\.getSchoolPrograms\(\)/);
  assert.match(component, /gestion des étudiants n’est pas encore modélisée/);
});
