import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error("Falta configurar DATABASE_URL en .env");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
