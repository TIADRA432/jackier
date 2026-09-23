import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('root layout exposes keyboard skip navigation and a focusable main landmark', async () => {
  const template = await source('src', 'app.component.html');

  assert.match(template, /href="#main-content"/);
  assert.match(template, />\s*Aller au contenu\s*</);
  assert.match(template, /id="main-content"/);
  assert.match(template, /tabindex="-1"/);
});

test('SPA navigation moves focus to main content only in the browser', async () => {
  const app = await source('src', 'app.component.ts');

  assert.match(app, /isPlatformBrowser/);
  assert.match(app, /getElementById\('main-content'\)/);
  assert.match(app, /focus\(\{ preventScroll: true \}\)/);
  assert.match(app, /queueMicrotask/);
});
