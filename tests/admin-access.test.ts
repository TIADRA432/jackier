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
  const controller = await source('src', 'controllers', 'dashboard.controller.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'dashboard', 'dashboard.component.ts');

  assert.match(service, /get<DashboardOverview>\(`\$\{this\.apiUrl\}\/dashboard\/overview`\)/);
  assert.match(component, /this\.adminData\.getDashboardOverview\(\)/);
  assert.match(component, /Aucune clôture financière enregistrée/);
  assert.match(controller, /\['pending', 'contacted', 'quoted', 'confirmed'\]/);
  assert.match(controller, /readinessChecks/);
  assert.match(controller, /activeWines/);
  assert.match(controller, /publicTeam/);
  assert.match(controller, /weeklyHours\?\.enabled === true/);
  assert.match(component, /Préparation à la livraison/);
  assert.match(component, /overview\(\)\.readiness\.percent/);
  assert.match(component, /Copier la liste à demander/);
  assert.match(component, /copyClientRequest\(\)/);
  assert.match(component, /navigator\.clipboard\.writeText/);
  assert.match(component, /owner === 'client'/);
  assert.match(component, /readinessPath/);
  assert.match(component, /Corriger maintenant/);
  assert.match(controller, /owner: 'client'/);
  assert.match(controller, /owner: 'admin'/);
  assert.match(controller, /nextAction/);
  assert.match(component, /Information client/);
  assert.match(component, /Action admin/);
  assert.match(component, /adminPending/);
  assert.match(component, /clientPending/);
  assert.match(controller, /pendingSchoolRegistrations/);
  assert.match(controller, /compactActivities/);
  assert.match(controller, /Configuration du site mise à jour/);
  assert.match(component, /À traiter maintenant/);
  assert.match(component, /priorityActions/);
  assert.match(component, /pendingReadinessChecks/);
  assert.match(component, /Inscriptions École à confirmer/);
  assert.match(component, /Dernières actions administratives utiles/);
});

test('admin header search notifications and identity are functional rather than decorative', async () => {
  const layout = await source('src', 'app', 'pages', 'admin', 'admin.component.ts');
  const auth = await source('src', 'app', 'core', 'services', 'admin-auth.service.ts');

  assert.match(layout, /ADMIN_SEARCH_ITEMS/);
  assert.match(layout, /onSearchInput\(\$event\)/);
  assert.match(layout, /navigateTo\(item\.path\)/);
  assert.match(layout, /Rechercher un module, une action/);
  assert.match(layout, /this\.adminData\.getDashboardOverview\(\)/);
  assert.match(layout, /this\.adminData\.getSchoolRegistrations\(\)/);
  assert.match(layout, /Réservations en attente/);
  assert.match(layout, /Inscriptions École en attente/);
  assert.match(layout, /Informations client attendues/);
  assert.match(layout, /notificationCount/);
  assert.doesNotMatch(layout, /absolute top-1\.5 right-1\.5 w-2\.5 h-2\.5 bg-red-500/);
  assert.match(layout, /NavigationEnd/);
  assert.match(layout, /this\.isSidebarOpen\.set\(false\)/);
  assert.match(layout, /NavigationEnd[\s\S]*void this\.loadHeaderData\(\)/);
  assert.match(layout, /getCurrentUserEmail/);
  assert.match(auth, /async getCurrentUserEmail\(\)/);
  assert.match(auth, /supabaseClient\.auth\.getUser\(\)/);
});

test('the catering screen reads and updates only the protected catering API', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(service, /get<CateringEvent\[\]>\(`\$\{this\.apiUrl\}\/catering`\)/);
  assert.match(service, /put<CateringEvent>\(`\$\{this\.apiUrl\}\/catering\/\$\{id\}`, \{ status \}\)/);
  assert.match(component, /this\.adminData\.getCateringEvents\(\)/);
  assert.match(component, /this\.adminData\.updateCateringStatus/);
});

test('the school screen manages real programs sessions and registrations', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'school', 'school.component.ts');

  assert.match(service, /get<SchoolProgram\[\]>\(`\$\{this\.apiUrl\}\/admin\/school`\)/);
  assert.match(service, /get<SchoolSession\[\]>\(`\$\{this\.apiUrl\}\/admin\/school\/sessions`\)/);
  assert.match(service, /get<SchoolRegistration\[\]>\(`\$\{this\.apiUrl\}\/admin\/school\/registrations`\)/);
  assert.match(component, /this\.adminData\.getSchoolPrograms\(\)/);
  assert.match(component, /this\.adminData\.getSchoolSessions\(\)/);
  assert.match(component, /this\.adminData\.getSchoolRegistrations\(\)/);
  assert.match(component, /Sessions & jauges/);
  assert.match(component, /Inscriptions reçues/);
  assert.match(component, /paiement en ligne, PDF\/devis, e-mails transactionnels/);
});

test('the restaurant screen creates dishes and persists editorial changes', async () => {
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'restaurant', 'restaurant.component.ts');
  const controller = await source('src', 'controllers', 'menu.controller.ts');

  assert.match(service, /get<MenuItem\[\]>\(`\$\{this\.apiUrl\}\/admin\/menu`\)/);
  assert.match(service, /post<MenuItem>\(`\$\{this\.apiUrl\}\/menu`, payload\)/);
  assert.match(service, /put<MenuItem>\(`\$\{this\.apiUrl\}\/menu\/\$\{id\}`, payload\)/);
  assert.match(component, /this\.adminData\.getMenuItems\(\)/);
  assert.match(component, /this\.adminData\.createMenuItem/);
  assert.match(component, /this\.adminData\.getCategories\(\)/);
  assert.match(component, /this\.adminData\.getMediaAssets\(\)/);
  assert.match(component, /this\.adminData\.updateMenuItem/);
  assert.match(component, /Créer un plat/);
  assert.match(component, /toggleAvailability/);
  assert.match(controller, /category id is required/);
  assert.match(controller, /toMenuRow\(payload\)/);
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
  assert.match(service, /get<WineItem\[\]>\(`\$\{this\.apiUrl\}\/admin\/wines`\)/);
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

test('settings writes accept only validated public settings and the admin view persists them', async () => {
  const controller = await source('src', 'controllers', 'settings.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  assert.match(controller, /requireKnownFields\(body, SETTINGS_FIELDS\)/);
  assert.match(controller, /Invalid email/);
  assert.match(controller, /validateSocialMedia/);
  assert.match(controller, /validateBrand/);
  assert.match(service, /get<PublicSettings>\(`\$\{this\.apiUrl\}\/settings`\)/);
  assert.match(service, /put\(`\$\{this\.apiUrl\}\/settings`, payload\)/);
  assert.match(component, /this\.adminData\.getSettings\(\)/);
  assert.match(component, /this\.adminData\.updateSettings/);
  assert.match(component, /Identité visuelle/);
  assert.doesNotMatch(component, /Réinitialiser les données/);
});

test('gallery writes validate image URLs while the CMS uses the authenticated media library', async () => {
  const controller = await source('src', 'controllers', 'gallery.controller.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'cms', 'cms.component.ts');

  assert.match(controller, /optionalImageUrl\(body\.imageUrl\)/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'gallery image'\)/);
  assert.match(service, /get<GalleryMedia\[\]>\(`\$\{this\.apiUrl\}\/gallery`\)/);
  assert.match(service, /post<GalleryMedia>\(`\$\{this\.apiUrl\}\/gallery`, payload\)/);
  assert.match(component, /this\.adminData\.getMediaAssets\(\)/);
  assert.match(component, /this\.adminData\.uploadMediaAsset/);
  assert.match(component, /this\.adminData\.deleteMediaAsset/);
  assert.match(component, /<uppy-dashboard \[uppy\]="uppy"/);
  assert.match(component, /Texte alternatif/);
});

test('analytics reuses the protected dashboard overview instead of fabricated forecasts', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'analytics', 'analytics.component.ts');

  assert.match(component, /this\.adminData\.getDashboardOverview\(\)/);
  assert.match(component, /overview\(\)\.revenueChart/);
  assert.match(component, /overview\(\)\.recentActivities/);
  assert.doesNotMatch(component, /Prévisions de Fréquentation/);
  assert.doesNotMatch(component, /Générer Rapport PDF/);
});

test('inventory is backed by a protected API and validates writes before persistence', async () => {
  const controller = await source('src', 'controllers', 'inventory.controller.ts');
  const routes = await source('src', 'routes', 'index.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'stock', 'stock.component.ts');

  assert.match(controller, /requireKnownFields\(body, INVENTORY_FIELDS\)/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'inventory item'\)/);
  assert.match(routes, /router\.get\('\/inventory', verifyToken, requireRole\(\['ADMIN'\]\), getInventoryItems\)/);
  assert.match(routes, /router\.post\('\/inventory', verifyToken, requireRole\(\['ADMIN'\]\), createInventoryItem\)/);
  assert.match(service, /get<InventoryItem\[\]>\(`\$\{this\.apiUrl\}\/inventory`\)/);
  assert.match(component, /this\.adminData\.getInventoryItems\(\)/);
  assert.match(component, /this\.adminData\.updateInventoryItem/);
  assert.match(component, /this\.adminData\.deleteInventoryItem/);
  assert.doesNotMatch(component, /Gambas Tigrées/);
});

test('the internal team directory uses protected data without storing sensitive HR fields', async () => {
  const controller = await source('src', 'controllers', 'team.controller.ts');
  const routes = await source('src', 'routes', 'index.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const component = await source('src', 'app', 'pages', 'admin', 'equipe', 'equipe.component.ts');

  assert.match(controller, /requireKnownFields\(body, TEAM_FIELDS\)/);
  assert.match(controller, /validateUuid\(req\.params\.id, 'team member'\)/);
  assert.match(routes, /router\.get\('\/team', verifyToken, requireRole\(\['ADMIN'\]\), getTeamMembers\)/);
  assert.match(routes, /router\.post\('\/team', verifyToken, requireRole\(\['ADMIN'\]\), createTeamMember\)/);
  assert.match(service, /get<AdminTeamMember\[\]>\(`\$\{this\.apiUrl\}\/team`\)/);
  assert.match(component, /this\.adminData\.getTeamMembers\(\)/);
  assert.match(component, /this\.adminData\.updateTeamMember/);
  assert.doesNotMatch(component, /Masse Salariale/);
  assert.doesNotMatch(component, /Présents Aujourd'hui/);
});


test('admin navigation is responsive, compact and exposes real operational counters', async () => {
  const layout = await source('src', 'app', 'pages', 'admin', 'admin.component.ts');

  assert.match(layout, /lg:relative lg:translate-x-0/);
  assert.match(layout, /lg:hidden/);
  assert.match(layout, /pendingSchoolCount/);
  assert.match(layout, /overview\(\)\.stats\.pendingReservations/);
  assert.match(layout, /overview\(\)\.stats\.activeCatering/);
  assert.match(layout, /ariaCurrentWhenActive="page"/);
  assert.match(layout, /BACK OFFICE/);
  assert.match(layout, /p-4 sm:p-6 lg:p-8 xl:p-10/);
});

test('dashboard exposes compact metrics and direct actions for frequent admin tasks', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'dashboard', 'dashboard.component.ts');

  assert.match(component, /Vue opérationnelle/);
  assert.match(component, /Actions rapides/);
  assert.match(component, /quickActions/);
  assert.match(component, /\/admin\/restaurant/);
  assert.match(component, /\/admin\/galerie/);
  assert.match(component, /\/admin\/equipe/);
  assert.match(component, /\/admin\/settings/);
  assert.match(component, /xl:grid-cols-5/);
});

test('admin layout keeps visible scrollbars for long pages and horizontal tables', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'admin.component.ts');

  assert.match(component, /admin-scroll-area/);
  assert.match(component, /scrollbar-color: rgba\(212, 175, 55, 0\.78\) #1a1a1a/);
  assert.match(component, /overflow-x-auto::\-webkit-scrollbar/);
  assert.match(component, /height: 10px/);
  assert.match(component, /scrollbar-gutter: stable/);
});
