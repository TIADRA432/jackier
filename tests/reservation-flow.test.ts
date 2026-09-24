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
  assert.match(controller, /normalizeEmail\(existing\.email\) === reservationEmail/);
  assert.match(controller, /normalizePhone\(existing\.phone\) === reservationPhone/);
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


test('reservation workflow uses only booking-specific statuses while catering keeps its own statuses', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');
  const admin = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(model, /ReservationWorkflowStatus = 'pending' \| 'confirmed' \| 'cancelled' \| 'completed'/);
  assert.match(model, /status: ReservationWorkflowStatus/);
  assert.match(model, /CateringWorkflowStatus = 'pending' \| 'contacted' \| 'quoted' \| 'confirmed' \| 'completed' \| 'cancelled'/);
  assert.match(model, /export interface CateringEvent[\s\S]*status: CateringWorkflowStatus/);
  assert.match(controller, /ALLOWED_STATUSES = new Set(?:<ReservationWorkflowStatus>)?\(\['pending', 'confirmed', 'cancelled', 'completed'\]\)/);
  assert.match(admin, /statuses: ReservationWorkflowStatus\[\] = \['pending', 'confirmed', 'completed', 'cancelled'\]/);
  assert.doesNotMatch(admin, /approved: 'Approuvée'/);
  assert.doesNotMatch(admin, /rejected: 'Refusée'/);
});

test('reservation status updates are written to the activity log', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /UPDATE_RESERVATION_STATUS/);
  assert.match(controller, /Reservation #/);
  assert.match(controller, /req\.user\?\.id \|\| 'system'/);
});

test('reservation admin provides explicit manual client communication tools', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(admin, /Aucune notification automatique n’est envoyée actuellement/);
  assert.match(admin, /whatsappHref\(reservation\)/);
  assert.match(admin, /emailHref\(reservation\)/);
  assert.match(admin, /copyCustomerMessage\(reservation\)/);
  assert.match(admin, /customerMessage\(reservation/);
  assert.match(admin, /wa\.me/);
  assert.match(admin, /navigator\.clipboard\.writeText/);
  assert.match(admin, /Réservation #/);
});


test('reservation form removes expired same-day slots before submit', async () => {
  const component = await source('src', 'app', 'pages', 'reservation', 'reservation.component.ts');

  assert.match(component, /selectedDate === this\.todayDate/);
  assert.match(component, /conakryTimeMinutes\(\)/);
  assert.match(component, /toMinutes\(slot\) > now/);
  assert.match(component, /selectedDate < this\.todayDate/);
});

test('reservation duplicate detection compares normalized contact values', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /normalizeEmail/);
  assert.match(controller, /normalizePhone/);
  assert.match(controller, /sameEmail/);
  assert.match(controller, /samePhone/);
});

test('reservation receipt exposes only supported booking statuses', async () => {
  const service = await source('src', 'app', 'core', 'services', 'reservation.service.ts');

  assert.match(service, /status: 'pending' \| 'confirmed' \| 'cancelled' \| 'completed'/);
  assert.doesNotMatch(service, /approved/);
  assert.doesNotMatch(service, /rejected/);
});


test('reservation server normalizes legacy booking statuses before admin rendering', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');
  const model = await source('src', 'app', 'core', 'services', 'admin-data.service.ts');

  assert.match(controller, /value === 'approved'\) return 'confirmed'/);
  assert.match(controller, /value === 'rejected'\) return 'cancelled'/);
  assert.match(controller, /status: normalizeReservationStatus\(row\.status\)/);
  assert.doesNotMatch(model, /export type ReservationStatus =/);
});

test('reservation status update returns 404 when the booking no longer exists', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /maybeSingle\(\)/);
  assert.match(controller, /if \(!current\) return res\.status\(404\)/);
  assert.match(controller, /Reservation not found/);
});


test('reservation duplicate normalization treats local Guinea numbers consistently', async () => {
  const controller = await source('src', 'controllers', 'reservation.controller.ts');

  assert.match(controller, /digits\.startsWith\('00'\)/);
  assert.match(controller, /digits\.length === 9/);
  assert.match(controller, /224\$\{digits\}/);
});

test('reservation admin WhatsApp links canonicalize local Guinea numbers', async () => {
  const admin = await source('src', 'app', 'pages', 'admin', 'reservations', 'reservations.component.ts');

  assert.match(admin, /phone\.startsWith\('00'\)/);
  assert.match(admin, /phone\.length === 9/);
  assert.match(admin, /224\$\{phone\}/);
  assert.match(admin, /https:\/\/wa\.me/);
});
