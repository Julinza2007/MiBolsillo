import { Router } from 'express';
import { pool } from '../database.js';
import { requireAuth } from '../middleware/auth.js';
import { validateCategory } from '../utils/validation.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, type, is_default AS "isDefault"
       FROM categories WHERE user_id IS NULL OR user_id = $1
       ORDER BY type, is_default DESC, name`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateCategory(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos de la categoría.', fields: errors });
    const duplicate = await pool.query(
      `SELECT id FROM categories WHERE type = $1 AND LOWER(name) = LOWER($2)
       AND (user_id IS NULL OR user_id = $3) LIMIT 1`,
      [req.body.type, req.body.name.trim(), req.user.id],
    );
    if (duplicate.rowCount) return res.status(409).json({ error: 'Ya existe una categoría con ese nombre y tipo.' });
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, type, is_default)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id, name, type, is_default AS "isDefault"`,
      [req.user.id, req.body.name.trim(), req.body.type],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe una categoría con ese nombre y tipo.' });
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateCategory(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Revisá los datos de la categoría.', fields: errors });
    const duplicate = await pool.query(
      `SELECT id FROM categories WHERE type = $1 AND LOWER(name) = LOWER($2)
       AND (user_id IS NULL OR user_id = $3) AND id <> $4 LIMIT 1`,
      [req.body.type, req.body.name.trim(), req.user.id, req.params.id],
    );
    if (duplicate.rowCount) return res.status(409).json({ error: 'Ya existe una categoría con ese nombre y tipo.' });
    const existing = await pool.query(
      'SELECT id, type FROM categories WHERE id = $1 AND user_id = $2 AND is_default = FALSE',
      [req.params.id, req.user.id],
    );
    if (!existing.rowCount) return res.status(404).json({ error: 'No se encontró la categoría personalizada.' });
    if (existing.rows[0].type !== req.body.type) {
      const usage = await pool.query(
        'SELECT EXISTS (SELECT 1 FROM transactions WHERE category_id = $1) OR EXISTS (SELECT 1 FROM budgets WHERE category_id = $1) AS used',
        [req.params.id],
      );
      if (usage.rows[0].used) return res.status(409).json({ error: 'No podés cambiar el tipo de una categoría que ya está asociada a movimientos o presupuestos.' });
    }
    const result = await pool.query(
      `UPDATE categories SET name = $1, type = $2
       WHERE id = $3 AND user_id = $4 AND is_default = FALSE
       RETURNING id, name, type, is_default AS "isDefault"`,
      [req.body.name.trim(), req.body.type, req.params.id, req.user.id],
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Ya existe una categoría con ese nombre y tipo.' });
    if (error.code === '23503' || error.code === '23514') return res.status(409).json({ error: 'La categoría está asociada a movimientos o presupuestos, o el tipo no coincide.' });
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 AND user_id = $2 AND is_default = FALSE RETURNING id', [req.params.id, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'No se encontró la categoría personalizada.' });
    res.status(204).end();
  } catch (error) {
    if (error.code === '23503') return res.status(409).json({ error: 'No podés eliminar una categoría que tiene movimientos o presupuestos asociados.' });
    next(error);
  }
});

export default router;
