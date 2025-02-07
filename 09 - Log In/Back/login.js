const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "disney.cknylvg9zp2l.us-east-1.rds.amazonaws.com",
  database: "postgres",
  password: "12345678",  // Considera usar variables de entorno para seguridad
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// Ruta para login (POST)
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
