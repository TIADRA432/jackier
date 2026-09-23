import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts: string[]) => readFile(path.join(root, ...parts), 'utf8');

test('reservation visitor copy reflects a pending request instead of claiming confirmation', async () => {
  const component = await source('src', 'app', 'pages', 'reservation', 'reservation.component.ts');

  assert.match(component, /Demande de réservation reçue/);
  assert.match(component, /En attente de confirmation par le restaurant/);
  assert.match(component, /Aucun e-mail automatique n’est envoyé actuellement/);
  assert.match(component, /lastReservationReference/);
  assert.doesNotMatch(component, /Réservation Confirmée !/);
  assert.doesNotMatch(component, /Un email de confirmation vous a été envoyé/);
});

test('reservation service returns the created request receipt to the visitor', async () => {
  const service = await source('src', 'app', 'core', 'services', 'reservation.service.ts');

  assert.match(service, /export interface ReservationReceipt/);
  assert.match(service, /http\.post<ReservationReceipt>/);
  assert.match(service, /reservation: created/);
});

test('reservation server rejects past slots and respects configured weekly hours', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /validateConfiguredAvailability/);
  assert.match(controller, /Africa\/Conakry/);
  assert.match(controller, /date is in the past/);
  assert.match(controller, /time has already passed/);
  assert.match(controller, /restaurant is closed on this date/);
  assert.match(controller, /outside configured opening hours/);
  assert.match(controller, /weeklyHours/);
});

test('reservation server detects duplicate pending requests', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /ensureNoDuplicateReservation/);
  assert.match(controller, /\['cancelled', 'rejected'\]\.includes/);
  assert.match(controller, /existing\.email === reservation\.email \|\| existing\.phone === reservation\.phone/);
  assert.match(controller, /a similar request already exists for this date and time/);
});

test('reservation admin exposes contact details and request reference', async () => {
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const admin = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(model, /email\?: string/);
  assert.match(model, /phone\?: string/);
  assert.match(model, /createdAt\?: string/);
  assert.match(admin, /mailto:/);
  assert.match(admin, /tel:/);
  assert.match(admin, /shortReference/);
});
