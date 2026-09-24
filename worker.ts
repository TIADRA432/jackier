import express from 'express';
// cloudflare:node is provided by the Workers runtime.
// @ts-expect-error Cloudflare runtime module
import { httpServerHandler } from 'cloudflare:node';
import type { Fetcher, ExecutionContext } from '@cloudflare/workers-types';
import routes from './src/routes/index';
import { errorHandler } from './src/middlewares/error.middleware';
import { configureSecurity, staticAssetSecurityHeaders } from './src/middlewares/security.middleware';
import './src/config/supabase';

const app = express();

configureSecurity(app, { cloudflare: true });
app.use(express.json({ limit: '64kb' }));
app.use('/api', routes);
app.use(errorHandler);
app.listen(3000);

const apiHandler = httpServerHandler({ port: 3000 });
const DEFAULT_PUBLIC_ORIGIN = 'https://jackier.abdourahmane591.workers.dev';

interface Env {
  ASSETS: Fetcher;
}

const rewritePublicOrigin = async (response: Response, origin: string): Promise<Response> => {
  const contentType = response.headers.get('content-type') ?? '';
  const isTextAsset = /text\/html|text\/plain|application\/xml|text\/xml/i.test(contentType);
  if (!isTextAsset || origin === DEFAULT_PUBLIC_ORIGIN) return response;

  const body = (await response.text()).split(DEFAULT_PUBLIC_ORIGIN).join(origin);
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const withStaticSecurityHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(staticAssetSecurityHeaders)) {
    headers.set(name, value);
  }
  if (process.env.APP_ENV === 'preview') {
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api')) {
      const assetResponse = await env.ASSETS.fetch(request as any);
      if (assetResponse.status !== 404) {
        const rewrittenResponse = await rewritePublicOrigin(assetResponse, url.origin);
        return withStaticSecurityHeaders(rewrittenResponse);
      }
    }
    // `httpServerHandler` returns a Worker handler object. Calling the object
    // directly causes every API request to fail at runtime; delegate to its
    // fetch method so Express receives the request.
    return apiHandler.fetch(request, env, ctx);
  },
};
