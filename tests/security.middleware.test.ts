import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express from 'express';

process.env.CORS_ORIGINS = 'https://client.example';
process.env.NODE_ENV = 'test';

const { configureSecurity, publicWriteRateLimiter, staticAssetSecurityHeaders } = await import('../src/middlewares/security.middleware');
const { errorHandler } = await import('../src/middlewares/error.middleware');

const startServer = async (app: express.Express) => {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  };
};

test('allows only configured browser origins and sends security headers', async () => {
  const app = express();
  configureSecurity(app);
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  const server = await startServer(app);

  try {
    const allowed = await fetch(`${server.url}/health`, { headers: { Origin: 'https://client.example' } });
    assert.equal(allowed.status, 200);
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://client.example');
    assert.equal(allowed.headers.get('x-content-type-options'), 'nosniff');
    const csp = allowed.headers.get('content-security-policy') ?? '';
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /script-src 'self'/);
    assert.doesNotMatch(csp, /cdn\.tailwindcss\.com/);
    assert.doesNotMatch(csp, /esm\.sh/);
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/);

    const denied = await fetch(`${server.url}/health`, { headers: { Origin: 'https://untrusted.example' } });
    assert.equal(denied.status, 403);
    assert.deepEqual(await denied.json(), {
      success: false,
      error: 'Origin is not allowed',
      code: 'CORS_ORIGIN_DENIED',
    });
  } finally {
    await server.close();
  }
});

test('limits public write requests after five requests per client', async () => {
  const app = express();
  app.post('/write', publicWriteRateLimiter, (_req, res) => res.status(201).end());
  const server = await startServer(app);

  try {
    for (let index = 0; index < 5; index += 1) {
      assert.equal((await fetch(`${server.url}/write`, { method: 'POST' })).status, 201);
    }

    const blocked = await fetch(`${server.url}/write`, { method: 'POST' });
    assert.equal(blocked.status, 429);
    assert.deepEqual(await blocked.json(), {
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMITED',
    });
  } finally {
    await server.close();
  }
});

test('keeps the equivalent security headers for Cloudflare static assets', () => {
  assert.equal(staticAssetSecurityHeaders['X-Frame-Options'], 'DENY');
  assert.equal(staticAssetSecurityHeaders['X-Content-Type-Options'], 'nosniff');
  const csp = staticAssetSecurityHeaders['Content-Security-Policy'];
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /cdn\.tailwindcss\.com|esm\.sh/);
});

test('Worker clients without a socket IP keep separate quotas and cannot rotate X-Forwarded-For', async () => {
  const app = express();
  configureSecurity(app, { cloudflare: true });
  app.use((req, _res, next) => {
    Object.defineProperty(req, 'ip', { value: undefined });
    next();
  });
  app.post('/write', publicWriteRateLimiter, (_req, res) => res.status(201).end());
  app.use(errorHandler);
  const server = await startServer(app);
  const send = (ip: string, forwarded = '198.51.100.1') => fetch(`${server.url}/write`, {
    method: 'POST', headers: { 'CF-Connecting-IP': ip, 'X-Forwarded-For': forwarded },
  });
  try {
    for (let i = 0; i < 5; i++) {
      const response = await send('192.0.2.10', `198.51.100.${i + 1}`);
      assert.equal(response.status, 201);
      assert.match(response.headers.get('ratelimit') ?? '', /limit=5/);
    }
    assert.equal((await send('192.0.2.10', '198.51.100.99')).status, 429);
    assert.equal((await send('192.0.2.11')).status, 201);
    for (let i = 0; i < 5; i++) assert.equal((await send(`2001:db8:1234:5600::${i + 1}`)).status, 201);
    assert.equal((await send('2001:db8:1234:5600::99')).status, 429);
    for (let i = 0; i < 5; i++) assert.equal((await send('invalid')).status, 201);
    assert.equal((await send('also-invalid')).status, 429);
  } finally {
    await server.close();
  }
});
