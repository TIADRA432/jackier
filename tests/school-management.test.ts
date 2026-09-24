import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('school API protects admin catalogue sessions and participant data', async () => {
  const routes = await source('src', 'routes', 'index.ts');

  assert.match(routes, /router\.get\('\/school\/sessions', getPublicSchoolSessions\)/);
  assert.match(routes, /router\.post\('\/school\/registrations', publicWriteRateLimiter, createSchoolRegistration\)/);
  assert.match(routes, /router\.get\('\/admin\/school\/sessions', verifyToken, requireRole\(\['ADMIN'\]\), getAdminSchoolSessions\)/);
  assert.match(routes, /router\.get\('\/admin\/school\/registrations', verifyToken, requireRole\(\['ADMIN'\]\), getSchoolRegistrations\)/);
  assert.match(routes, /router\.put\('\/school\/registrations\/:id\/status', verifyToken, requireRole\(\['ADMIN'\]\), updateSchoolRegistrationStatus\)/);
});

test('school sessions calculate remaining capacity and block unsafe capacity reductions', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');

  assert.match(controller, /registrationCountBySession/);
  assert.match(controller, /remainingPlaces/);
  assert.match(controller, /Capacity cannot be lower than current registrations/);
  assert.match(controller, /Session end must be after start/);
  assert.match(controller, /Session start must be in the future/);
});

test('school registrations use an atomic database function to prevent overbooking', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');
  const migration = await source('supabase', 'migrations', '20260924093000_atomic_school_registration.sql');

  assert.match(controller, /rpc\('register_school_participant'/);
  assert.match(controller, /session_full/);
  assert.match(controller, /duplicate_registration/);
  assert.match(migration, /for update/);
  assert.match(migration, /v_count >= v_session\.capacity/);
  assert.match(migration, /grant execute .* service_role/);
  assert.match(migration, /revoke all .* anon/);
});

test('reactivating a cancelled registration remains capacity-safe', async () => {
  const controller = await source('src', 'controllers', 'school.controller.ts');
  const migration = await source('supabase', 'migrations', '20260924094500_atomic_school_registration_status.sql');

  assert.match(controller, /rpc\('update_school_registration_status'/);
  assert.match(controller, /ne peut pas être réactivée/);
  assert.match(migration, /v_registration\.status = 'cancelled'/);
  assert.match(migration, /v_count >= v_session\.capacity/);
  assert.match(migration, /for update/);
});

test('school database keeps registrations private and only exposes published upcoming sessions', async () => {
  const migration = await source('supabase', 'migrations', '20260924090000_school_v1_sessions_registrations.sql');

  assert.match(migration, /create table if not exists public\.school_sessions/);
  assert.match(migration, /create table if not exists public\.school_registrations/);
  assert.match(migration, /Public read upcoming school sessions/);
  assert.match(migration, /status = 'scheduled'/);
  assert.match(migration, /coalesce\(data->>'status', 'draft'\) = 'published'/);
  assert.match(migration, /Server role manages school registrations/);
  assert.doesNotMatch(migration, /Public read school registrations/);
});

test('school admin manages programme lifecycle sessions and registration statuses', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'school', 'school.component.ts');
  const service = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');

  assert.match(admin, /Créer un atelier ou masterclass/);
  assert.match(admin, /Archiver/);
  assert.match(admin, /Planifier un créneau/);
  assert.match(admin, /Sessions & jauges/);
  assert.match(admin, /Inscriptions reçues/);
  assert.match(admin, /changeRegistrationStatus/);
  assert.match(admin, /registrationPeriod/);
  assert.match(admin, /À relancer/);
  assert.match(admin, /needsFollowUp/);
  assert.match(service, /createSchoolSession/);
  assert.match(service, /updateSchoolRegistrationStatus/);
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
