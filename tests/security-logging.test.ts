import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('production server logger emits only event code and safe context', async () => {
  const logger = await source('src', 'utils', 'server-log.ts');

  assert.match(logger, /process\.env\.NODE_ENV === 'production'/);
  assert.match(logger, /safeErrorCode/);
  assert.match(logger, /console\[level\]\(\{/);
  assert.doesNotMatch(logger, /stack:/);
  assert.doesNotMatch(logger, /message:/);
});

test('sensitive server paths use the production-safe logger', async () => {
  const errorMiddleware = await source('src', 'middlewares', 'error.middleware.ts');
  const auth = await source('src', 'middleware', 'auth.middleware.ts');
  const reservation = await source('src', 'controllers', 'reservation.controller.ts');
  const catering = await source('src', 'controllers', 'catering.controller.ts');
  const dashboard = await source('src', 'controllers', 'dashboard.controller.ts');

  for (const file of [errorMiddleware, auth, reservation, catering, dashboard]) {
    assert.match(file, /serverLog/);
  }

  assert.doesNotMatch(errorMiddleware, /console\.error\('API Error:'\s*,\s*err\)/);
  assert.doesNotMatch(auth, /console\.error\('Error verifying Supabase token:'/);
  assert.doesNotMatch(auth, /console\.error\('Error checking user role:'/);
  assert.doesNotMatch(reservation, /console\.warn\('Unable to write reservation status log:'/);
  assert.doesNotMatch(catering, /console\.warn\('Unable to write catering status log:'/);
  assert.doesNotMatch(dashboard, /console\.error\('Error fetching dashboard overview:'/);
});

test('API error responses stay generic for unexpected failures', async () => {
  const middleware = await source('src', 'middlewares', 'error.middleware.ts');

  assert.match(middleware, /error: 'Internal Server Error'/);
  assert.match(middleware, /code: 'INTERNAL_ERROR'/);
  assert.doesNotMatch(middleware, /stack.*res\.status/s);
});
