import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('catering visitor flow shows an honest pending receipt with a reference', async () => {
  const form = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');

  assert.match(form, /Demande de devis reçue/);
  assert.match(form, /En attente de traitement/);
  assert.match(form, /requestReference/);
  assert.match(form, /Aucun délai automatique ni confirmation par e-mail n’est garanti actuellement/);
  assert.doesNotMatch(form, /sous 24h ouvrées/);
});

test('catering public page uses real event gallery content and no fictitious testimonials', async () => {
  const page = await source('src', 'app', 'pages', 'traiteur', 'traiteur.component.ts');
  const gallery = await source('src', 'app', 'shared', 'components', 'catering-gallery', 'catering-gallery.component.ts');

  assert.doesNotMatch(page, /app-catering-testimonials/);
  assert.match(gallery, /getGalleryImages\(\)/);
  assert.match(gallery, /image\.category === 'evenements'/);
  assert.doesNotMatch(gallery, /picsum\.photos/);
});

test('catering server validates fields dates guests event types and duplicates', async () => {
  const controller = await source('src', 'controllers', 'catering.controller.ts');

  assert.match(controller, /ALLOWED_EVENT_TYPES/);
  assert.match(controller, /Invalid catering field/);
  assert.match(controller, /date < conakryDateString\(\)/);
  assert.match(controller, /MAX_GUESTS/);
  assert.match(controller, /ensureNoDuplicateCateringRequest/);
  assert.match(controller, /Invalid catering duplicate request/);
});

test('catering CTA uses configured restaurant phone and makes no SLA promise', async () => {
  const cta = await source('src', 'app', 'shared', 'components', 'catering-cta', 'catering-cta.component.ts');

  assert.match(cta, /SiteSettingsService/);
  assert.match(cta, /phoneHref\(\)/);
  assert.match(cta, /siteSettings\.publicInfo\(\)\.phone/);
  assert.doesNotMatch(cta, /sous 24h/);
});

test('catering admin exposes request contacts and short reference', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(admin, /mailto:/);
  assert.match(admin, /tel:/);
  assert.match(admin, /shortReference/);
});
