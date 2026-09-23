import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

const { validateReservation } = await import('../src/controllers/reservation.controller');
const { validateCateringPayload } = await import('../src/controllers/catering.controller');
const { validateMenuPayload } = await import('../src/controllers/menu.controller');
const { validateGalleryPayload } = await import('../src/controllers/gallery.controller');

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

test('validates catering requests with a narrow public contract', () => {
  const request = {
    name: 'Aïssatou Diallo',
    phone: '+224 620 00 00 00',
    email: 'aissatou@example.com',
    eventType: 'mariage',
    date: '2026-10-10',
    guests: 120,
    budget: '12000000',
    message: 'Réception familiale à Conakry.'
  };

  assert.deepEqual(validateCateringPayload(request), request);
  assert.throws(() => validateCateringPayload({ ...request, unexpected: true }), /Invalid catering field/);
  assert.throws(() => validateCateringPayload({ ...request, eventType: 'inconnu' }), /Invalid catering event type/);
  assert.throws(() => validateCateringPayload({ ...request, guests: 0 }), /Invalid catering guests/);
});


test('accepts menu edits that clear optional presentation fields', () => {
  assert.deepEqual(validateMenuPayload({
    shortDescription: null,
    imageUrl: null,
    displayOrder: 3,
    isFeatured: true,
  }, true), {
    shortDescription: null,
    imageUrl: null,
    displayOrder: 3,
    isFeatured: true,
  });
});


test('validates gallery editorial category and display order', () => {
  assert.deepEqual(validateGalleryPayload({
    imageUrl: 'https://example.com/gallery.webp',
    title: 'Service en terrasse',
    category: 'ambiance',
    displayOrder: 20,
  }), {
    imageUrl: 'https://example.com/gallery.webp',
    title: 'Service en terrasse',
    category: 'ambiance',
    displayOrder: 20,
  });

  assert.deepEqual(validateGalleryPayload({ category: 'cuisine', displayOrder: 5 }, true), {
    category: 'cuisine',
    displayOrder: 5,
  });

  assert.throws(() => validateGalleryPayload({ category: 'inconnue' }, true), /Invalid gallery category/);
  assert.throws(() => validateGalleryPayload({ displayOrder: -1 }, true), /Invalid display order/);
});
