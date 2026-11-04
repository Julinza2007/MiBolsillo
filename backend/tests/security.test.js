import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, createToken, readToken } from '../src/utils/security.js';

process.env.JWT_SECRET = 'test-secret-with-more-than-thirty-two-characters';

test('almacena contraseñas con hash y verifica la contraseña original', async () => {
  const hash = await hashPassword('mi-clave-segura');
  assert.notEqual(hash, 'mi-clave-segura');
  assert.equal(await verifyPassword('mi-clave-segura', hash), true);
  assert.equal(await verifyPassword('otra-clave', hash), false);
});

test('firma y valida tokens de sesión', () => {
  const token = createToken({ id: 12, name: 'Ana', email: 'ana@example.com' });
  const decoded = readToken(token);
  assert.equal(decoded.id, 12);
  assert.equal(decoded.email, 'ana@example.com');
  const parts = token.split('.');
  const forgedSignature = Buffer.from(parts[2], 'base64url');
  forgedSignature[0] ^= 0xff;
  assert.throws(() => readToken(`${parts[0]}.${parts[1]}.${forgedSignature.toString('base64url')}`));
});
