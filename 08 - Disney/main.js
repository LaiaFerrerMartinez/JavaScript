// IMPORTS EN JAVA
const express = require("express");  // API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg");  // HABLAR BD PG DE AWS (pgAdmin4)
const cors = require("cors");

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const pool = new Pool({
  user: "postgres",
  host: "disney.cknylvg9zp2l.us-east-1.rds.amazonaws.com",
  database: "postgres",
  password: "12345678", // Considera usar variables de entorno para gestionar contraseñas
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Obtener todas las películas
app.get("/peliculas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id AS pelicula_id, 
             p.titulo AS pelicula_titulo, 
             p.descripcion AS pelicula_descripcion, 
             p.anio AS pelicula_anio, 
             g.titulo AS genero_titulo, 
             s.nombre AS saga_nombre, 
             p.imagen_url AS pelicula_imagen_url
      FROM peliculas p
      INNER JOIN generos g ON p.genero_id = g.id
      LEFT JOIN sagas s ON p.saga_id = s.id;
    `);
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
    const { rows } = await pool.query(`
      SELECT p.id AS pelicula_id, 
             p.titulo AS pelicula_titulo, 
             p.descripcion AS pelicula_descripcion, 
             p.anio AS pelicula_anio, 
             g.titulo AS genero_titulo, 
             s.nombre AS saga_nombre, 
             p.imagen_url AS pelicula_imagen_url
      FROM peliculas p
      INNER JOIN generos g ON p.genero_id = g.id
      LEFT JOIN sagas s ON p.saga_id = s.id
      WHERE p.titulo = $1;
    `, [titulo]);
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
  const { titulo, descripcion, anio, genero_id, saga_id, imagen_url } = req.body;
  if (!titulo || !descripcion || !anio || !genero_id) {
    return res.status(400).send('Faltan datos para crear la película');
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO peliculas (titulo, descripcion, anio, genero_id, saga_id, imagen_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [titulo, descripcion, anio, genero_id, saga_id, imagen_url]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al insertar la película:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar una película
app.put("/peliculas", async (req, res) => {
  const { id, titulo, descripcion, anio, genero_id, saga_id, imagen_url } = req.body;
  if (!id || !titulo || !descripcion || !anio || !genero_id) {
    return res.status(400).send('Faltan datos para actualizar la película');
  }
  try {
    const { rows } = await pool.query(
      "UPDATE peliculas SET titulo = $2, descripcion = $3, anio = $4, genero_id = $5, saga_id = $6, imagen_url = $7 WHERE id = $1 RETURNING *",
      [id, titulo, descripcion, anio, genero_id, saga_id, imagen_url]
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

// Filtrar películas por saga
app.get("/peliculas/saga", async (req, res) => {
  const { saga } = req.query;  // Obtenemos la saga de la query string
  let query = `
    SELECT p.id AS pelicula_id, 
           p.titulo AS pelicula_titulo, 
           p.descripcion AS pelicula_descripcion, 
           p.anio AS pelicula_anio, 
           g.titulo AS genero_titulo, 
           s.nombre AS saga_nombre, 
           p.imagen_url AS pelicula_imagen_url
    FROM peliculas p
    INNER JOIN generos g ON p.genero_id = g.id
    LEFT JOIN sagas s ON p.saga_id = s.id
  `;
  let params = [];
  
  if (saga) {
    query += " WHERE s.nombre = $1";  // Filtramos por la saga si se pasa como parámetro
    params.push(saga);
  }

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las películas por saga:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
