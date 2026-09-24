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


test('catering workflow uses dedicated operational statuses', async () => {
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const controller = await source('src', 'controllers', 'catering.controller.ts');
  const admin = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(model, /CateringWorkflowStatus = 'pending' \| 'contacted' \| 'quoted' \| 'confirmed' \| 'completed' \| 'cancelled'/);
  assert.match(controller, /ALLOWED_STATUSES = new Set\(\['pending', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'\]\)/);
  assert.match(admin, /Devis envoyé/);
  assert.match(admin, /Contacté/);
  assert.doesNotMatch(admin, /Approuvé/);
  assert.doesNotMatch(admin, /Refusé/);
});

test('catering status changes are auditable', async () => {
  const controller = await source('src', 'controllers', 'catering.controller.ts');

  assert.match(controller, /UPDATE_CATERING_STATUS/);
  assert.match(controller, /Catering request #/);
  assert.match(controller, /req\.user\?\.id \|\| 'system'/);
});

test('catering admin exposes honest manual client communication', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(admin, /Aucune notification automatique n’est envoyée/);
  assert.match(admin, /whatsappHref\(event\)/);
  assert.match(admin, /emailHref\(event\)/);
  assert.match(admin, /copyCustomerMessage\(event\)/);
  assert.match(admin, /navigator\.clipboard\.writeText/);
  assert.match(admin, /wa\.me/);
});

test('catering admin flags stale pending requests', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(admin, /isPastPending\(event\)/);
  assert.match(admin, /Date dépassée alors que la demande est toujours en attente/);
  assert.match(admin, /Africa\/Conakry/);
});
