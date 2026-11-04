import 'dotenv/config';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Falta configurar DATABASE_URL en backend/.env');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX || 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export async function initializeDatabase() {
  const schemaPath = fileURLToPath(new URL('./db/schema.sql', import.meta.url));
  const schema = await readFile(schemaPath, 'utf8');
  await pool.query(schema);
}
