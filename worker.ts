import express from 'express';
// cloudflare:node is provided by the Workers runtime.
// @ts-expect-error Cloudflare runtime module
import { httpServerHandler } from 'cloudflare:node';
import type { Fetcher, ExecutionContext } from '@cloudflare/workers-types';
import routes from './src/routes/index';
import { errorHandler } from './src/middlewares/error.middleware';
import { configureSecurity } from './src/middlewares/security.middleware';
import './src/config/supabase';

const app = express();

configureSecurity(app);
app.use(express.json({ limit: '64kb' }));
app.use('/api', routes);
app.use(errorHandler);
app.listen(3000);

const apiHandler = httpServerHandler({ port: 3000 });

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api')) {
      const assetResponse = await env.ASSETS.fetch(request as any);
      if (assetResponse.status !== 404) return assetResponse;
    }
    return apiHandler(request, env, ctx);
  },
};
