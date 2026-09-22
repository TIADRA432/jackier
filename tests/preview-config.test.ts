import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node imports the build-time JavaScript utility directly.
import { previewConfiguration } from '../scripts/prepare-preview.mjs';
const env = { PREVIEW_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co', PREVIEW_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fictional' };
test('preview fails closed without its own database and public key', () => {
  for (const url of ['', 'https://pesraxtkhkruiipjkrty.supabase.co', 'https://example.org', 'http://abcdefghijklmnopqrst.supabase.co']) {
    assert.throws(() => previewConfiguration({ ...env, PREVIEW_SUPABASE_URL: url }));
  }
  assert.throws(() => previewConfiguration({ ...env, PREVIEW_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_forbidden' }));
});
test('preview uses a separate worker and the same test database for client and API', () => {
  const { frontend, worker } = previewConfiguration(env);
  assert.equal(worker.name, 'jackier-preview');
  assert.equal(worker.vars.SUPABASE_URL, frontend.supabase.url);
  assert.equal(worker.assets.run_worker_first, true);
  assert.equal(worker.routes, undefined);
  assert.equal(JSON.stringify(frontend).includes('SERVICE_ROLE'), false);
});
