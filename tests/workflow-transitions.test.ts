import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('reservation workflow enforces sequential status transitions server-side', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /RESERVATION_TRANSITIONS/);
  assert.match(controller, /pending: new Set\(\['confirmed', 'cancelled'\]\)/);
  assert.match(controller, /confirmed: new Set\(\['completed', 'cancelled'\]\)/);
  assert.match(controller, /completed: new Set\(\)/);
  assert.match(controller, /cancelled: new Set\(\)/);
  assert.match(controller, /status transition/);
  assert.match(controller, /return res\.status\(409\)/);
});

test('reservation admin only offers current and valid next statuses', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(component, /availableStatuses\(reservation\)/);
  assert.match(component, /pending: \['confirmed', 'cancelled'\]/);
  assert.match(component, /confirmed: \['completed', 'cancelled'\]/);
  assert.match(component, /return \[reservation\.status, \.\.\.this\.transitions\[reservation\.status\]\]/);
});

test('catering workflow enforces sequential lifecycle server-side', async () => {
  const controller = await source('src', 'controllers', 'catering.controller.ts');

  assert.match(controller, /CATERING_TRANSITIONS/);
  assert.match(controller, /pending: new Set\(\['contacted', 'cancelled'\]\)/);
  assert.match(controller, /contacted: new Set\(\['quoted', 'cancelled'\]\)/);
  assert.match(controller, /quoted: new Set\(\['confirmed', 'cancelled'\]\)/);
  assert.match(controller, /confirmed: new Set\(\['completed', 'cancelled'\]\)/);
  assert.match(controller, /return res\.status\(409\)/);
});

test('catering admin mirrors the server lifecycle', async () => {
  const component = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(component, /availableStatuses\(event\)/);
  assert.match(component, /pending: \['contacted', 'cancelled'\]/);
  assert.match(component, /contacted: \['quoted', 'cancelled'\]/);
  assert.match(component, /quoted: \['confirmed', 'cancelled'\]/);
  assert.match(component, /confirmed: \['completed', 'cancelled'\]/);
  assert.match(component, /return \[event\.status, \.\.\.this\.transitions\[event\.status\]\]/);
});
