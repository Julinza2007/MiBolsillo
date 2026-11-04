import { Router } from 'express';
import { pool } from '../database.js';
import { requireAuth } from '../middleware/auth.js';
import { monthRange } from '../utils/validation.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000 || year > 2100) return res.status(400).json({ error: 'El período solicitado no es válido.' });
    const { first, next: nextMonth } = monthRange(month, year);

    const summaryResult = await pool.query(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)::float8 AS income,
         COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)::float8 AS expenses,
         COUNT(*)::int AS movements
       FROM transactions WHERE user_id = $1 AND movement_date >= $2::date AND movement_date < $3::date`,
      [req.user.id, first, nextMonth],
    );
    const trendResult = await pool.query(
      `WITH months AS (
         SELECT generate_series(date_trunc('month', CURRENT_DATE) - INTERVAL '5 months', date_trunc('month', CURRENT_DATE), INTERVAL '1 month') AS month_start
       )
       SELECT TO_CHAR(m.month_start, 'Mon') AS label,
         COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'), 0)::float8 AS income,
         COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0)::float8 AS expenses
       FROM months m LEFT JOIN transactions t ON t.user_id = $1
         AND t.movement_date >= m.month_start::date AND t.movement_date < (m.month_start + INTERVAL '1 month')::date
       GROUP BY m.month_start ORDER BY m.month_start`,
      [req.user.id],
    );
    const categoryResult = await pool.query(
      `SELECT c.name, COALESCE(SUM(t.amount), 0)::float8 AS amount
       FROM transactions t JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = $1 AND t.type = 'expense' AND t.movement_date >= $2::date AND t.movement_date < $3::date
       GROUP BY c.name ORDER BY amount DESC LIMIT 6`,
      [req.user.id, first, nextMonth],
    );
    const recentResult = await pool.query(
      `SELECT t.id, t.type, t.description, t.amount::float8 AS amount,
              TO_CHAR(t.movement_date, 'YYYY-MM-DD') AS date, c.name AS "categoryName"
       FROM transactions t JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = $1 ORDER BY t.movement_date DESC, t.id DESC LIMIT 6`,
      [req.user.id],
    );
    const budgetResult = await pool.query(
      `SELECT b.id, c.name AS "categoryName", b.amount::float8 AS amount,
              COALESCE(SUM(t.amount), 0)::float8 AS spent
       FROM budgets b JOIN categories c ON c.id = b.category_id
       LEFT JOIN transactions t ON t.user_id = b.user_id AND t.category_id = b.category_id
         AND t.type = 'expense' AND t.movement_date >= MAKE_DATE(b.year, b.month, 1)
         AND t.movement_date < (MAKE_DATE(b.year, b.month, 1) + INTERVAL '1 month')
       WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
       GROUP BY b.id, c.name ORDER BY c.name LIMIT 4`,
      [req.user.id, month, year],
    );
    const summary = summaryResult.rows[0];
    res.json({
      period: { month, year },
      summary: { ...summary, balance: Number(summary.income) - Number(summary.expenses) },
      trend: trendResult.rows,
      categories: categoryResult.rows,
      recent: recentResult.rows,
      budgets: budgetResult.rows.map((budget) => ({ ...budget, percentage: budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0, exceeded: budget.spent >= budget.amount })),
    });
  } catch (error) { next(error); }
});

export default router;
