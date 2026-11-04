import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Ruta de prueba
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "MiBolsillo API funcionando correctamente"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});