import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL ??= 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY ??= 'test-service-role-key';

const { validateReservation } = await import('../src/controllers/reservation.controller.ts');

const valid = {
  name: 'Aissatou Barry',
  email: 'Client@Example.com',
  phone: '+224 625 67 53 63',
  date: '2099-12-31',
  time: '19:30',
  guests: 2,
};

test('reservation validation normalizes email and accepts a realistic phone number', () => {
  const reservation = validateReservation(valid);
  assert.equal(reservation.email, 'client@example.com');
  assert.equal(reservation.phone, '+224 625 67 53 63');
});

test('reservation validation rejects malformed phone values', () => {
  assert.throws(
    () => validateReservation({ ...valid, phone: 'appelez-moi demain' }),
    /Invalid phone number/
  );
});
