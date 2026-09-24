import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
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
  const smoke = await source('scripts', 'smoke-production.sh');

  assert.match(workflow, /bash scripts\/smoke-production\.sh/);

  for (const route of ['/about', '/gallery', '/services-traiteur', '/ecole-gastronomie', '/admin/login']) {
    assert.match(smoke, new RegExp(route.replace(/\//g, '\\/')));
  }

  assert.match(smoke, /security-headers\.txt/);
  assert.match(smoke, /content-security-policy/);
  assert.match(smoke, /X-Content-Type-Options = nosniff/);
  assert.match(smoke, /X-Frame-Options = DENY/);
  assert.match(smoke, /HSTS présent/);
  assert.match(smoke, /Scripts limités au même origin/);
  assert.match(smoke, /Legacy script source still allowed/);
  assert.match(smoke, /frame-src 'self'.*maps.*google.*com.*www.*google.*com/);
  assert.match(smoke, /item\?\.active === false/);
});


test('production smoke script has valid Bash syntax', () => {
  const result = spawnSync('bash', ['-n', path.join(root, 'scripts', 'smoke-production.sh')], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('public dish cards replace broken remote images with a local fallback', async () => {
  const component = await source('src', 'app', 'shared', 'components', 'dish-card', 'dish-card.component.ts');

  assert.match(component, /\(error\)="useFallbackImage\(\$event\)"/);
  assert.match(component, /fallbackApplied/);
  assert.match(component, /image\.src = '\/og-image\.png'/);
});

test('Cloudflare static assets receive the same security headers as Worker responses', async () => {
  const headers = await source('public', '_headers');
  const angular = await source('angular.json');

  assert.match(angular, /"input": "public"/);
  assert.match(headers, /\/\*/);
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /script-src 'self'/);
  assert.match(headers, /frame-src 'self' https:\/\/maps\.google\.com https:\/\/www\.google\.com/);
  assert.match(headers, /Strict-Transport-Security: max-age=15552000; includeSubDomains/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy: no-referrer/);
});
