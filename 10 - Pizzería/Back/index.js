require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

const server = app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});

app.get("/peliculas", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM peliculas");
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
});

app.get("/peliculas/generos", async (req, res) => {
    try {
        const { rows } = await pool.query (`
            SELECT * FROM PELICULAS
                INNER JOIN GENEROS ON genero_id = GENEROS.id
                WHERE upper (GENEROS.titulo) LIKE 'ANIMACIÓN';`
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener películas por género:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})