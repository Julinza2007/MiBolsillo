import { Router } from 'express';
import { pool } from '../database.js';
import { createToken, hashPassword, verifyPassword } from '../utils/security.js';
import { isValidEmail, isValidPassword } from '../utils/validation.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body?.password;
    const errors = {};
    if (name.length < 2 || name.length > 80) errors.name = 'El nombre debe tener entre 2 y 80 caracteres.';
    if (!isValidEmail(email)) errors.email = 'Ingresá un correo electrónico válido.';
    if (!isValidPassword(password)) errors.password = 'La contraseña debe tener entre 8 y 128 caracteres.';
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos ingresados.', fields: errors });

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash],
    );
    const user = result.rows[0];
    return res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe una cuenta con ese correo electrónico.' });
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body?.password;
    if (!isValidEmail(email) || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Ingresá un correo y una contraseña válidos.' });
    }
    const result = await pool.query('SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'El correo o la contraseña son incorrectos.' });
    }
    const safeUser = { id: user.id, name: user.name, email: user.email };
    return res.json({ token: createToken(safeUser), user: safeUser });
  } catch (error) {
    return next(error);
  }
});

export default router;
