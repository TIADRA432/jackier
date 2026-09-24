import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('production shell does not depend on Tailwind CDN or esm.sh importmaps', async () => {
  const index = await source('index.html');
  const angular = await source('angular.json');
  const styles = await source('src', 'styles.css');
  const postcss = await source('.postcssrc.json');
  const pkg = await source('package.json');

  assert.doesNotMatch(index, /cdn\.tailwindcss\.com/);
  assert.doesNotMatch(index, /esm\.sh/);
  assert.doesNotMatch(index, /picsum\.photos/);
  assert.doesNotMatch(index, /type="importmap"/);
  assert.match(angular, /"styles": \[\s*"src\/styles\.css"/);
  assert.match(styles, /@import "tailwindcss"/);
  assert.match(styles, /--color-jacquier-primary/);
  assert.match(postcss, /@tailwindcss\/postcss/);
  assert.match(pkg, /"@tailwindcss\/postcss"/);
  assert.match(pkg, /"postcss"/);
});

test('compiled global motion respects reduced-motion preferences', async () => {
  const styles = await source('src', 'styles.css');

  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /scroll-behavior: auto/);
  assert.match(styles, /animate-fade-in-up/);
});


test('production smoke test covers the complete public shell and security headers', async () => {
  const workflow = await source('.github', 'workflows', 'deploy-cloudflare.yml');

  for (const route of ['/about', '/gallery', '/services-traiteur', '/ecole-gastronomie', '/admin/login']) {
    assert.match(workflow, new RegExp(route.replace(/\//g, '\\/')));
  }

  assert.match(workflow, /security-headers\.txt/);
  assert.match(workflow, /content-security-policy/);
  assert.match(workflow, /x-content-type-options: nosniff/);
  assert.match(workflow, /x-frame-options: DENY/);
  assert.match(workflow, /strict-transport-security/);
  assert.match(workflow, /frame-src 'self' https:\/\/maps\.google\.com https:\/\/www\.google\.com/);
  assert.match(workflow, /item\?\.active === false/);
});
