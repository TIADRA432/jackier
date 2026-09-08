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

test('the restaurant screen reads all protected menu data and persists availability changes', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'restaurant', 'restaurant.component.ts');

  assert.match(service, /get<MenuItem\[\]>\(`\$\{this\.apiUrl\}\/admin\/menu`\)/);
  assert.match(service, /put<MenuItem>\(`\$\{this\.apiUrl\}\/menu\/\$\{id\}`, payload\)/);
  assert.match(component, /this\.adminData\.getMenuItems\(\)/);
  assert.match(component, /this\.adminData\.updateMenuItem/);
  assert.match(component, /toggleAvailability/);
});

test('menu availability has a public-safe contract and protected admin catalogue', async () => {
  const controller = await source('src', 'controllers', 'menu.controller.ts');
  const routes = await source('src', 'routes', 'index.ts');
  const publicService = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');

  assert.match(controller, /item\.active !== false/);
  assert.match(controller, /active: payload\.active \?\? true/);
  assert.match(controller, /validateMenuPayload/);
  assert.match(routes, /router\.get\('\/admin\/menu', verifyToken, requireRole\(\['ADMIN'\]\), getMenuItems\)/);
  assert.match(publicService, /filter\(item => item\.active !== false\)/);
});

test('category and wine writes whitelist their payloads and validate identifiers', async () => {
  const category = await source('src', 'controllers', 'category.controller.ts');
  const wine = await source('src', 'controllers', 'wine.controller.ts');
  const validation = await source('src', 'controllers', 'catalog.validation.ts');

  assert.match(category, /requireKnownFields/);
  assert.match(category, /validateUuid\(req\.params\.id, 'category'\)/);
  assert.match(wine, /requireKnownFields/);
  assert.match(wine, /validateUuid\(req\.params\.id, 'wine'\)/);
  assert.match(validation, /UUID_PATTERN/);
  assert.match(validation, /CatalogValidationError/);
});

test('category and wine admin screens use the authenticated catalogue API', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const categories = await source('src', 'app', 'pages', 'admin', 'categories', 'categories.component.ts');
  const wines = await source('src', 'app', 'pages', 'admin', 'wines', 'wines.component.ts');

  assert.match(service, /get<MenuCategory\[\]>\(`\$\{this\.apiUrl\}\/categories`\)/);
  assert.match(service, /post<MenuCategory>\(`\$\{this\.apiUrl\}\/categories`, payload\)/);
  assert.match(service, /get<WineItem\[\]>\(`\$\{this\.apiUrl\}\/wines`\)/);
  assert.match(service, /post<WineItem>\(`\$\{this\.apiUrl\}\/wines`, payload\)/);
  assert.match(categories, /this\.adminData\.createCategory/);
  assert.match(categories, /this\.adminData\.deleteCategory/);
  assert.match(wines, /this\.adminData\.createWine/);
  assert.match(wines, /this\.adminData\.deleteWine/);
});

test('finance writes validate a narrow payload and the admin screen uses protected finance data', async () => {
  const controller = await source('src', 'controllers', 'finance.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'finance', 'finance.component.ts');

  assert.match(controller, /requireKnownFields\(body, EXPENSE_FIELDS\)/);
  assert.match(controller, /amount must be greater than zero/);
  assert.match(controller, /requireKnownFields\(body, DAILY_CLOSE_FIELDS\)/);
  assert.match(service, /get<FinanceExpense\[\]>\(`\$\{this\.apiUrl\}\/finance\/expenses`\)/);
  assert.match(service, /post<FinanceReport>\(`\$\{this\.apiUrl\}\/finance\/close`, \{ manualRevenue \}\)/);
  assert.match(component, /this\.adminData\.getExpenses\(\)/);
  assert.match(component, /this\.adminData\.addExpense/);
  assert.match(component, /this\.adminData\.closeDay/);
  assert.doesNotMatch(component, /342\.5M FG/);
});
