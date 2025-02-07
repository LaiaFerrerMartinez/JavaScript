const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Configuración de la base de datos PostgreSQL
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

// Middleware común
app.use(express.json());
app.use(cors());

// Rutas para el servidor de películas
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

// Rutas para el servidor de login
app.post('/api/login', async (req, res) => {
  const { nombre_usuario, password } = req.body;

  if (!nombre_usuario || !password) {
    return res.status(400).json({ message: 'Faltan datos de login' });
  }

  try {
    const sqlQuery = `SELECT * FROM USUARIOS WHERE nombre_usuario = $1 AND password = $2`;
    const result = await pool.query(sqlQuery, [nombre_usuario, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    res.json({ message: 'Login correcto', nombre_usuario: result.rows[0].nombre_usuario });
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
const server = app.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
