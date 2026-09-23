import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('team schema adds only presentation and organization fields', async () => {
  const migration = await source('supabase', 'migrations', '20260922200000_expand_team_management.sql');

  assert.match(migration, /department text not null default 'salle'/);
  assert.match(migration, /bio text/);
  assert.match(migration, /display_order integer not null default 0/);
  assert.match(migration, /public_visible boolean not null default false/);
  assert.doesNotMatch(migration, /salary|payroll|contract|attendance|leave/i);
});

test('team API separates protected directory from curated public profiles', async () => {
  const controller = await source('src', 'controllers', 'team.controller.ts');
  const routes = await source('src', 'routes', 'index.ts');

  assert.match(controller, /TEAM_DEPARTMENTS/);
  assert.match(controller, /publicVisible/);
  assert.match(controller, /displayOrder/);
  assert.match(controller, /getPublicTeamMembers/);
  assert.match(controller, /\.eq\('active', true\)/);
  assert.match(controller, /\.eq\('public_visible', true\)/);
  assert.match(routes, /router\.get\('\/team\/public', getPublicTeamMembers\)/);
  assert.match(routes, /router\.get\('\/team', verifyToken, requireRole\(\['ADMIN'\]\), getTeamMembers\)/);
});

test('admin team manager supports departments public visibility media portraits and ordering', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'equipe', 'equipe.component.ts');

  assert.match(component, /Équipe & Personnel/);
  assert.match(component, /Aperçu de l’équipe publique/);
  assert.match(component, /Afficher publiquement/);
  assert.match(component, /departmentFilter/);
  assert.match(component, /teamImages\(\)/);
  assert.match(component, /togglePublic\(member/);
  assert.match(component, /move\(member, -1\)/);
  assert.match(component, /move\(member, 1\)/);
  assert.doesNotMatch(component, /Masse Salariale|Présents Aujourd'hui/);
});

test('About page uses managed public team data instead of fictitious profiles', async () => {
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');
  const about = await source('src', 'app', 'pages', 'about', 'about.component.ts');

  assert.match(service, /\/team\/public/);
  assert.match(service, /loadTeam\(\)/);
  assert.doesNotMatch(service, /Chef Amadou Diallo/);
  assert.doesNotMatch(service, /Sophie Martin/);
  assert.match(about, /teamLoading/);
  assert.match(about, /Aucun profil d’équipe n’est publié pour le moment/);
});
