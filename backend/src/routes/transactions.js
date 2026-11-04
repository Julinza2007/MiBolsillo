import { Router } from 'express';
import { pool } from '../database.js';
import { requireAuth } from '../middleware/auth.js';
import { isValidDate, validateMovement } from '../utils/validation.js';

const router = Router();
router.use(requireAuth);

async function checkCategory(categoryId, type, userId) {
  const result = await pool.query(
    `SELECT id FROM categories
     WHERE id = $1 AND type = $2 AND (user_id IS NULL OR user_id = $3)`,
    [categoryId, type, userId],
  );
  return result.rowCount > 0;
}

router.get('/', async (req, res, next) => {
  try {
    const conditions = ['t.user_id = $1'];
    const values = [req.user.id];
    const add = (sql, value) => { values.push(value); conditions.push(sql.replace('?', `$${values.length}`)); };
    if (req.query.type && ['income', 'expense'].includes(req.query.type)) add('t.type = ?', req.query.type);
    if (req.query.categoryId && Number.isInteger(Number(req.query.categoryId))) add('t.category_id = ?', Number(req.query.categoryId));
    if (req.query.from && isValidDate(req.query.from)) add('t.movement_date >= ?::date', req.query.from);
    if (req.query.to && isValidDate(req.query.to)) add('t.movement_date <= ?::date', req.query.to);
    if (req.query.search && String(req.query.search).trim()) add('t.description ILIKE ?', `%${String(req.query.search).trim().slice(0, 80)}%`);
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    values.push(limit);
    const result = await pool.query(
      `SELECT t.id, t.type, t.description, t.amount::float8 AS amount,
              TO_CHAR(t.movement_date, 'YYYY-MM-DD') AS date,
              t.category_id AS "categoryId", c.name AS "categoryName"
       FROM transactions t JOIN categories c ON c.id = t.category_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY t.movement_date DESC, t.id DESC LIMIT $${values.length}`,
      values,
    );
    res.json(result.rows);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateMovement(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos del movimiento.', fields: errors });
    if (!(await checkCategory(req.body.categoryId, req.body.type, req.user.id))) {
      return res.status(400).json({ error: 'La categoría no existe o no corresponde al tipo de movimiento.' });
    }
    const result = await pool.query(
      `INSERT INTO transactions (user_id, category_id, type, description, amount, movement_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, description, amount::float8 AS amount, TO_CHAR(movement_date, 'YYYY-MM-DD') AS date, category_id AS "categoryId"`,
      [req.user.id, req.body.categoryId, req.body.type, req.body.description.trim(), req.body.amount, req.body.date],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateMovement(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos del movimiento.', fields: errors });
    if (!(await checkCategory(req.body.categoryId, req.body.type, req.user.id))) {
      return res.status(400).json({ error: 'La categoría no existe o no corresponde al tipo de movimiento.' });
    }
    const result = await pool.query(
      `UPDATE transactions SET category_id = $1, type = $2, description = $3, amount = $4, movement_date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING id, type, description, amount::float8 AS amount, TO_CHAR(movement_date, 'YYYY-MM-DD') AS date, category_id AS "categoryId"`,
      [req.body.categoryId, req.body.type, req.body.description.trim(), req.body.amount, req.body.date, req.params.id, req.user.id],
    );
    if (!result.rowCount) return res.status(404).json({ error: 'No se encontró el movimiento.' });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'No se encontró el movimiento.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
