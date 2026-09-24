import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('staging Cloudflare worker is isolated from production Supabase', async () => {
  const config = JSON.parse(await source('wrangler.staging.jsonc'));

  assert.equal(config.name, 'jackier-staging');
  assert.equal(config.vars.SUPABASE_URL, 'https://ojqjfxejixjakyflrubx.supabase.co');
  assert.equal(config.vars.CORS_ORIGINS, 'https://jackier-staging.abdourahmane591.workers.dev');
  assert.notEqual(config.vars.SUPABASE_URL, 'https://pesraxtkhkruiipjkrty.supabase.co');
});

test('staging deployment stays manual and develop-only', async () => {
  const workflow = await source('.github', 'workflows', 'deploy-staging.yml');

  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /push:\s*\n\s*branches:/);
  assert.match(workflow, /refs\/heads\/develop/);
  assert.match(workflow, /wrangler\.staging\.jsonc/);
  assert.match(workflow, /jackier-staging\.abdourahmane591\.workers\.dev/);
});

test('staging service-role key is referenced only through GitHub secrets', async () => {
  const workflow = await source('.github', 'workflows', 'deploy-staging.yml');
  const config = await source('wrangler.staging.jsonc');

  assert.match(workflow, /secrets\.STAGING_SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(workflow, /wrangler secret put SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(workflow, /eyJ[A-Za-z0-9_-]{20,}/);
  assert.doesNotMatch(config, /eyJ[A-Za-z0-9_-]{20,}/);
});

test('staging bootstrap contains schema only and never production rows', async () => {
  const bootstrap = await source('supabase', 'staging', 'bootstrap.sql');

  assert.match(bootstrap, /create table if not exists public\.reservations/);
  assert.match(bootstrap, /create table if not exists public\.school_programs/);
  assert.match(bootstrap, /enable row level security/);
  assert.doesNotMatch(bootstrap, /insert into public\.(reservations|catering_events|profiles|logs)/i);
});
