import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

const { validateReservation } = await import('../src/controllers/reservation.controller');
const { validateCateringPayload } = await import('../src/controllers/catering.controller');

test('accepts a valid public reservation payload', () => {
  const reservation = validateReservation({
    firstName: 'Aïssatou',
    lastName: 'Diallo',
    email: 'aissatou@example.com',
    phone: '+224 620 00 00 00',
    date: '2026-10-10',
    time: '19:30',
    guests: 4,
    notes: 'Table au calme, si possible.',
  });

  assert.equal(reservation.name, 'Aïssatou Diallo');
  assert.equal(reservation.email, 'aissatou@example.com');
});

test('rejects invalid reservation dates, time slots and guest counts', () => {
  const validPayload = {
    name: 'Mamadou Camara',
    email: 'mamadou@example.com',
    phone: '+224 610 00 00 00',
    date: '2026-10-10',
    time: '19:30',
    guests: 2,
  };

  assert.throws(() => validateReservation({ ...validPayload, date: '2026-02-30' }), /Invalid reservation date/);
  assert.throws(() => validateReservation({ ...validPayload, time: '18:00' }), /Invalid reservation time/);
  assert.throws(() => validateReservation({ ...validPayload, guests: 9 }), /guests must be between 1 and 8/);
});

test('rejects excessively nested catering payloads', () => {
  const tooDeep = { a: { b: { c: { d: { e: { f: 'value' } } } } } };

  assert.throws(() => validateCateringPayload(tooDeep), /Payload nesting is too deep/);
  assert.deepEqual(validateCateringPayload({ eventType: 'Mariage', guests: 120 }), {
    eventType: 'Mariage',
    guests: 120,
  });
});
