import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function previewConfiguration(env) {
  const url = new URL(env.PREVIEW_SUPABASE_URL || 'https://missing.invalid');
  if (!/^https:\/\/[a-z]{20}\.supabase\.co\/?$/.test(url.href) ||
      url.hostname === 'pesraxtkhkruiipjkrty.supabase.co') {
    throw new Error('PREVIEW_SUPABASE_URL must identify a separate Supabase test project.');
  }
  const key = env.PREVIEW_SUPABASE_PUBLISHABLE_KEY || '';
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error('A test project publishable key is required; server keys are forbidden in the frontend.');
  }
  return {
    frontend: { production: true, apiUrl: '/api', supabase: { url: url.origin, publishableKey: key } },
    worker: {
      name: 'jackier-preview', main: '../worker.ts',
      compatibility_date: '2026-09-04', compatibility_flags: ['nodejs_compat'],
      workers_dev: true, preview_urls: false,
      assets: { directory: '../dist', binding: 'ASSETS', not_found_handling: 'single-page-application', run_worker_first: true },
      vars: { SUPABASE_URL: url.origin, CORS_ORIGINS: '', APP_ENV: 'preview' },
      secrets: { required: ['SUPABASE_SERVICE_ROLE_KEY'] }
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const config = previewConfiguration(process.env);
  mkdirSync('.preview', { recursive: true });
  writeFileSync('.preview/wrangler.json', JSON.stringify(config.worker, null, 2));
  writeFileSync('src/environments/environment.preview.ts', `export const environment = ${JSON.stringify(config.frontend, null, 2)};\n`);
  console.log('Prepared isolated jackier-preview configuration.');
}
