import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const DEV_SECRET = 'mibolsillo-development-secret-change-before-deploy';

function jwtSecret() {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? DEV_SECRET : '');
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
  return secret;
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const derived = Buffer.from(await scrypt(password, salt, 64));
  const expected = Buffer.from(hash, 'hex');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function createToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: String(user.id), email: user.email, name: user.name, iat: now, exp: now + 60 * 60 * 24 * 7 })).toString('base64url');
  const data = `${header}.${payload}`;
  const signature = createHmac('sha256', jwtSecret()).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function readToken(token) {
  const [header, payload, signature] = String(token || '').split('.');
  if (!header || !payload || !signature) throw new Error('Token inválido.');
  const data = `${header}.${payload}`;
  const expected = createHmac('sha256', jwtSecret()).update(data).digest();
  const received = Buffer.from(signature, 'base64url');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new Error('Token inválido.');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!decoded.sub || decoded.exp < Math.floor(Date.now() / 1000)) throw new Error('La sesión expiró.');
  return { id: Number(decoded.sub), email: decoded.email, name: decoded.name };
}
