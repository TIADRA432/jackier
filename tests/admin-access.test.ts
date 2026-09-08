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
