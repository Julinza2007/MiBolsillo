import { readToken } from '../utils/security.js';

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  try {
    if (!token) return res.status(401).json({ error: 'Necesitás iniciar sesión.' });
    req.user = readToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: 'La sesión no es válida o expiró.' });
  }
}
