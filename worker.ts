import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node';
import routes from './src/routes/index';
import { errorHandler } from './src/middlewares/error.middleware';
import './src/config/supabase';

const app = express();
app.use(cors());
app.use(express.json());
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
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) return assetResponse;
    }
    return apiHandler(request, env, ctx);
  }
};
