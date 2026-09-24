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
  assert.match(controller, /ALLOWED_STATUSES = new Set(?:<CateringWorkflowStatus>)?\(\['pending', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'\]\)/);
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


test('catering server validates and normalizes visitor contact details', async () => {
  const controller = await source('src', 'controllers', 'catering.controller.ts');

  assert.match(controller, /Invalid catering phone/);
  assert.match(controller, /normalizePhone/);
  assert.match(controller, /normalizeEmail/);
  assert.match(controller, /digits\.length === 9/);
  assert.match(controller, /224\$\{digits\}/);
  assert.match(controller, /sameEmail/);
  assert.match(controller, /samePhone/);
});

test('catering form mirrors server limits before submit', async () => {
  const form = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');

  assert.match(form, /Validators\.max\(5000\)/);
  assert.match(form, /Validators\.maxLength\(160\)/);
  assert.match(form, /Validators\.maxLength\(254\)/);
  assert.match(form, /Validators\.maxLength\(120\)/);
  assert.match(form, /Validators\.maxLength\(2000\)/);
  assert.match(form, /\^\\\+\?\[0-9 \(\)-\]\{6,30\}\$/);
});

test('catering API uses typed validation errors and returns 404 for missing admin records', async () => {
  const controller = await source('src', 'controllers', 'catering.controller.ts');

  assert.match(controller, /class CateringValidationError extends Error/);
  assert.match(controller, /error instanceof CateringValidationError/);
  assert.match(controller, /maybeSingle\(\)/);
  assert.match(controller, /Catering request not found/);
  assert.doesNotMatch(controller, /message\.startsWith\('Invalid catering'\)/);
});

test('catering visitor receives stable French error messages', async () => {
  const service = await source('src', 'app', 'core', 'services', 'restaurant.service.ts');
  const form = await source('src', 'app', 'shared', 'components', 'catering-form', 'catering-form.component.ts');

  assert.match(service, /describeCateringError/);
  assert.match(service, /Une demande similaire existe déjà/);
  assert.match(service, /Le numéro de téléphone n’est pas valide/);
  assert.match(service, /Le nombre d’invités doit être compris entre 1 et 5 000/);
  assert.match(form, /err instanceof Error/);
});

test('catering admin WhatsApp links canonicalize local Guinea numbers', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'traiteur', 'traiteur.component.ts');

  assert.match(admin, /phone\.startsWith\('00'\)/);
  assert.match(admin, /phone\.length === 9/);
  assert.match(admin, /224\$\{phone\}/);
});


test('catering dashboard counts legacy approved dossiers as active confirmed work', async () => {
  const dashboard = await source('src', 'controllers', 'dashboard.controller.ts');

  assert.match(dashboard, /\['pending', 'contacted', 'quoted', 'confirmed', 'approved'\]/);
});
