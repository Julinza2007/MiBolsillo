import 'dotenv/config';
import express from 'express';
import { pool, initializeDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', message: 'MiBolsillo API funcionando correctamente' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Recurso no encontrado.' }));
app.use((error, _req, res, _next) => {
  console.error('API error:', error.message);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cuerpo de la solicitud no contiene JSON válido.' });
  if (error.code === '23503') return res.status(409).json({ error: 'La operación no puede completarse porque existen datos relacionados.' });
  res.status(500).json({ error: 'Ocurrió un error interno. Intentá nuevamente.' });
});

export { app };

async function startServer() {
  try {
    await initializeDatabase();
    await pool.query('SELECT 1');
    console.log('PostgreSQL conectado correctamente');
    app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
  } catch (error) {
    console.error('No se pudo iniciar MiBolsillo:', error.message);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') startServer();
