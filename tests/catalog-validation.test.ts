import assert from 'node:assert/strict';
import test from 'node:test';
import { optionalImageUrl, requiredText, validateUuid } from '../src/controllers/catalog.validation.ts';

test('accepts bounded text and secure image URLs used by admin catalogue forms', () => {
  assert.equal(requiredText('  Cheffe de salle  ', 'role', 120), 'Cheffe de salle');
  assert.equal(optionalImageUrl('https://cdn.example.com/team/aissatou.jpg'), 'https://cdn.example.com/team/aissatou.jpg');
});

test('rejects unsafe URLs, empty text and malformed resource identifiers', () => {
  assert.throws(() => optionalImageUrl('ftp://example.com/photo.jpg'), /Invalid image URL/);
  assert.throws(() => requiredText('   ', 'name', 160), /Invalid name/);
  assert.throws(() => validateUuid('not-a-uuid', 'team member'), /Invalid team member id/);
});
