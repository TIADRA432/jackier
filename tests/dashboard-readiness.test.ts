import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('dashboard readiness requires the same core establishment fields as admin settings', async () => {
  const dashboard = await source('src', 'controllers', 'dashboard.controller.ts');
  const settings = await source('src', 'app', 'pages', 'admin', 'settings', 'settings.component.ts');

  for (const field of ['restaurantName', 'address', 'phone', 'email', 'openingHours']) {
    assert.match(dashboard, new RegExp(field));
    assert.match(settings, new RegExp(field));
  }

  assert.match(dashboard, /CORE_SETTINGS_FIELDS/);
  assert.match(dashboard, /missingCoreSettings/);
  assert.match(dashboard, /hasCoreSettings/);
  assert.doesNotMatch(dashboard, /complete:\s*Boolean\(settings\.data\)/);
});
