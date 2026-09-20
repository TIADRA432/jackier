import cors, { type CorsOptions } from 'cors';
import type { Application, RequestHandler } from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { isIP } from 'node:net';
import helmet from 'helmet';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const SUPABASE_ORIGIN = 'https://pesraxtkhkruiipjkrty.supabase.co';

const normalizeOrigin = (value: string): string => {
  const url = new URL(value.trim());
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('CORS_ORIGINS only supports http and https origins');
  }
  return url.origin;
};

const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const allowedOrigins = new Set(configuredOrigins);

// Chaque déploiement Cloudflare Workers (Gradual Deployments) génère une URL de preview
// préfixée par un hash de version, ex: https://bd293e49-jackier.abdourahmane591.workers.dev
// Ce préfixe change à chaque déploiement : une entrée statique dans CORS_ORIGINS devrait
// être mise à jour manuellement à chaque fois. On accepte donc le motif de ces URLs de
// preview pour CE worker précis, en plus de la liste explicite CORS_ORIGINS.
const PREVIEW_ORIGIN_PATTERN = /^https:\/\/[a-f0-9]{8}-jackier\.abdourahmane591\.workers\.dev$/;

const createCorsError = () =>
  Object.assign(new Error('Origin is not allowed by CORS policy'), {
    code: 'CORS_ORIGIN_DENIED',
    status: 403,
  });

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests without Origin are non-browser or same-origin requests. Browsers
    // sending another origin must be explicitly listed in CORS_ORIGINS, or match
    // the version-preview URL pattern for this worker.
    if (!origin || allowedOrigins.has(origin) || PREVIEW_ORIGIN_PATTERN.test(origin)) {
      callback(null, true);
      return;
    }
    callback(createCorsError());
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  maxAge: 86_400,
  optionsSuccessStatus: 204,
};

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://esm.sh",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${SUPABASE_ORIGIN} ${SUPABASE_ORIGIN.replace('https://', 'wss://')}`,
].join('; ');

// Cloudflare serves static assets before the Express app. Apply equivalent
// headers in worker.ts so the HTML document receives the same protection.
export const staticAssetSecurityHeaders: Readonly<Record<string, string>> = {
  'Content-Security-Policy': `${contentSecurityPolicy}; upgrade-insecure-requests`,
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
};

export const configureSecurity = (app: Application, options: { cloudflare?: boolean } = {}): void => {
  // Cloudflare/other reverse proxies provide the client address through
  // X-Forwarded-For, allowing the limiter to identify callers correctly.
  app.set('trust proxy', options.cloudflare ? false : 1);
  // Only the Worker entry point may trust Cloudflare's overwritten edge header.
  app.set('cloudflare client ip', options.cloudflare === true);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://esm.sh'],
          scriptSrcAttr: ["'none'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: ["'self'", SUPABASE_ORIGIN, SUPABASE_ORIGIN.replace('https://', 'wss://')],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
      },
      // The site intentionally loads remote images and Google fonts. Enabling
      // COEP would block those resources unless every provider opted in.
      crossOriginEmbedderPolicy: false,
      hsts: process.env.NODE_ENV === 'production' ? undefined : false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.use(cors(corsOptions));
};

export const publicWriteRateLimiter: RequestHandler = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: RATE_LIMIT_MAX_REQUESTS,
  // draft-7 avoids draft-8 partition hashing in the Workers Node adapter.
  standardHeaders: 'draft-7',
  keyGenerator: (req) => {
    const edgeIp = req.app.get('cloudflare client ip') === true
      ? req.get('CF-Connecting-IP')
      : undefined;
    const ip = edgeIp && isIP(edgeIp) ? edgeIp : req.ip;
    // The Workers HTTP adapter may not provide a socket remoteAddress. Never
    // pass undefined to the limiter; unknown callers share a conservative quota.
    return ip && isIP(ip) ? ipKeyGenerator(ip) : 'unknown-client';
  },
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMITED',
  },
});
