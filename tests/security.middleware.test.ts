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
    assert.match(allowed.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/);

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
  assert.match(staticAssetSecurityHeaders['Content-Security-Policy'], /default-src 'self'/);
});
