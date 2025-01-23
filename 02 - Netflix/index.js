// IMPORTS EN JAVA
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const pool = new Pool({
  user: "postgres",
  host: "netflix-001.c3smyaeku6nl.us-east-1.rds.amazonaws.com",
  database: "postgres",
  password: "rerreF_2013", // Considera usar variables de entorno para gestionar contraseñas
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Obtener todas las películas
app.get("/peliculas", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM peliculas;");
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Obtener una película por su título
app.get("/peliculas/:title", async (req, res) => {
  const titulo = req.params.title;
  try {
    const { rows } = await pool.query("SELECT * FROM peliculas WHERE titulo = $1;", [titulo]);
    if (rows.length === 0) {
      return res.status(404).send('Película no encontrada');
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la película:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Insertar una nueva película
app.post("/peliculas", async (req, res) => {
  const { id, titulo, director, anio, genero } = req.body;
  if (!id || !titulo || !director || !anio || !genero) {
    return res.status(400).send('Faltan datos para crear la película');
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO peliculas (id, titulo, director, anio, genero) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, titulo, director, anio, genero]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al insertar la película:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar una película
app.put("/peliculas", async (req, res) => {
  const { id, titulo, director, anio, genero } = req.body;
  if (!id || !titulo || !director || !anio || !genero) {
    return res.status(400).send('Faltan datos para actualizar la película');
  }
  try {
    const { rows } = await pool.query(
      "UPDATE peliculas SET titulo = $2, director = $3, anio = $4, genero = $5 WHERE id = $1 RETURNING *",
      [id, titulo, director, anio, genero]
    );
    if (rows.length === 0) {
      return res.status(404).send('Película no encontrada para actualizar');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar la película:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Consultar todos los usuarios (solo ejemplo, puedes implementarlo como lo necesites)
app.get("/usuarios/", (req, res) => {
  res.send('Has solicitado una lista de usuarios');
});

app.get("/usuarios/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`El ID del usuario es: ${userId}`);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.get("/peliculas", async (req, res) => {
    const { genero } = req.query;  // Obtenemos el género de la query string
    let query = "SELECT * FROM peliculas";  // Consulta base
    let params = [];
  
    if (genero) {
      query += " WHERE genero = $1";  // Si se pasa un género, filtramos por él
      params.push(genero);
    }
  
    
      const { rows } = await pool.query(query, params);
      res.json(rows);
    
  });
  
