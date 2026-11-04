import { Router } from 'express';
import { pool } from '../database.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBudget } from '../utils/validation.js';

const router = Router();
router.use(requireAuth);

function periodFromQuery(query) {
  const now = new Date();
  const month = Number(query.month) || now.getMonth() + 1;
  const year = Number(query.year) || now.getFullYear();
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000 || year > 2100) return null;
  return { month, year };
}

router.get('/', async (req, res, next) => {
  try {
    const period = periodFromQuery(req.query);
    if (!period) return res.status(400).json({ error: 'El período solicitado no es válido.' });
    const result = await pool.query(
      `SELECT b.id, b.category_id AS "categoryId", c.name AS "categoryName",
              b.month, b.year, b.amount::float8 AS amount,
              COALESCE(SUM(t.amount), 0)::float8 AS spent
       FROM budgets b
       JOIN categories c ON c.id = b.category_id
       LEFT JOIN transactions t ON t.user_id = b.user_id AND t.category_id = b.category_id
         AND t.type = 'expense'
         AND t.movement_date >= MAKE_DATE(b.year, b.month, 1)
         AND t.movement_date < (MAKE_DATE(b.year, b.month, 1) + INTERVAL '1 month')
       WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
       GROUP BY b.id, c.name ORDER BY c.name`,
      [req.user.id, period.month, period.year],
    );
    res.json(result.rows.map((row) => ({ ...row, remaining: Math.max(0, row.amount - row.spent), percentage: row.amount > 0 ? Math.round((row.spent / row.amount) * 100) : 0, exceeded: row.spent >= row.amount })));
  } catch (error) { next(error); }
});

async function checkExpenseCategory(categoryId, userId) {
  const result = await pool.query("SELECT id FROM categories WHERE id = $1 AND type = 'expense' AND (user_id IS NULL OR user_id = $2)", [categoryId, userId]);
  return result.rowCount > 0;
}

router.post('/', async (req, res, next) => {
  try {
    const errors = validateBudget(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos del presupuesto.', fields: errors });
    if (!(await checkExpenseCategory(req.body.categoryId, req.user.id))) return res.status(400).json({ error: 'Los presupuestos solo pueden asociarse a categorías de gastos.' });
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, month, year, amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, category_id AS "categoryId", month, year, amount::float8 AS amount`,
      [req.user.id, req.body.categoryId, req.body.month, req.body.year, req.body.amount],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe un presupuesto para esa categoría y período.' });
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateBudget(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos del presupuesto.', fields: errors });
    if (!(await checkExpenseCategory(req.body.categoryId, req.user.id))) return res.status(400).json({ error: 'Los presupuestos solo pueden asociarse a categorías de gastos.' });
    const result = await pool.query(
      `UPDATE budgets SET category_id = $1, month = $2, year = $3, amount = $4
       WHERE id = $5 AND user_id = $6
       RETURNING id, category_id AS "categoryId", month, year, amount::float8 AS amount`,
      [req.body.categoryId, req.body.month, req.body.year, req.body.amount, req.params.id, req.user.id],
    );
    if (!result.rowCount) return res.status(404).json({ error: 'No se encontró el presupuesto.' });
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe un presupuesto para esa categoría y período.' });
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'No se encontró el presupuesto.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
