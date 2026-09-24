import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('delegates API requests through the Cloudflare Node handler fetch method', async () => {
  const worker = await readFile(new URL('../worker.ts', import.meta.url), 'utf8');

  assert.match(worker, /return apiHandler\.fetch\(request, env, ctx\);/);
  assert.doesNotMatch(worker, /return apiHandler\(request, env, ctx\);/);
});


test('rewrites static SEO origins to the actual request domain', async () => {
  const worker = await readFile(new URL('../worker.ts', import.meta.url), 'utf8');

  assert.match(worker, /DEFAULT_PUBLIC_ORIGIN/);
  assert.match(worker, /rewritePublicOrigin/);
  assert.match(worker, /split\(DEFAULT_PUBLIC_ORIGIN\)\.join\(origin\)/);
  assert.match(worker, /await rewritePublicOrigin\(assetResponse, url\.origin\)/);
  assert.match(worker, /headers\.delete\('content-length'\)/);
});
