CREATE TABLE genero1 (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL
);

CREATE TABLE peliculas1 (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    anio INTEGER,
    genero_id INTEGER REFERENCES genero1(id) ON DELETE CASCADE,
    imagen_url VARCHAR(255)
);

SELECT * FROM PELICULAS;

INSERT INTO genero1 (titulo) VALUES
('Acción'),
('Comedia'),
('Drama'),
('Ciencia Ficción'),
('Terror');

SELECT * FROM GENERO1;

-- Insertar películas en la tabla peliculas1
INSERT INTO peliculas1 (titulo, descripcion, anio, genero_id, imagen_url) VALUES
('Misión Imposible', 'Película de acción protagonizada por Tom Cruise.', 1996, 1, 'https://example.com/mission-impossible.jpg'),
('Superbad', 'Una comedia sobre adolescentes en su último año de secundaria.', 2007, 2, 'https://example.com/superbad.jpg'),
('El Padrino', 'Drama clásico sobre la mafia italiana en Estados Unidos.', 1972, 3, 'https://example.com/el-padrino.jpg'),
('Interestelar', 'Película de ciencia ficción sobre la exploración del espacio.', 2014, 4, 'https://example.com/interestelar.jpg'),
('El Conjuro', 'Película de terror basada en hechos reales.', 2013, 5, 'https://example.com/el-conjuro.jpg');

-- Verificar los datos insertados en peliculas1
SELECT * FROM peliculas1;

-- JOIN
SELECT 
    p.id AS pelicula_id,
    p.titulo AS pelicula_titulo,
    p.descripcion AS pelicula_descripcion,
    p.anio AS pelicula_anio,
    g.id AS genero_id,
    g.titulo AS genero_titulo,
    p.imagen_url AS pelicula_imagen_url
FROM 
    peliculas1 p
INNER JOIN 
    genero1 g
ON 
    p.genero_id = g.id;
