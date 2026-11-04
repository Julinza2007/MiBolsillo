import "dotenv/config";
import express from "express";
import { pool } from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "MiBolsillo API funcionando correctamente"
    });
});

// Iniciar servidor
async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("PostgreSQL conectado correctamente");

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar con PostgreSQL:", error.message);
        process.exit(1);
    }
}

startServer();