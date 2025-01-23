let peliculas = [];  // Aquí guardamos todas las películas

// Función para cargar todas las películas
function cargarPeliculas() {
    fetch("http://127.0.0.1:3000/peliculas")
        .then(res => res.json())
        .then(data => {
            peliculas = data;  // Guardamos todas las películas en el array
            mostrarPeliculas(peliculas);  // Mostramos todas las películas inicialmente
        })
        .catch(error => {
            console.error('Error al cargar las películas:', error);
        });
}

// Función para mostrar las películas en la tabla
function mostrarPeliculas(peliculasFiltradas) {
    const tablaPeliculas = document.getElementById('peliculas-table');
    tablaPeliculas.innerHTML = ''; // Limpiamos la tabla antes de agregar los datos

    // Si no hay películas para mostrar, mostramos un mensaje
    if (peliculasFiltradas.length === 0) {
        tablaPeliculas.innerHTML = '<tr><td colspan="5">No se encontraron películas</td></tr>';
        return;
    }

    peliculasFiltradas.forEach(pelicula => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pelicula.id}</td>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.anio}</td>
            <td>${pelicula.genero}</td>
        `;
        tablaPeliculas.appendChild(row);
    });
}

// Función para filtrar las películas por género
function filtrarPorGenero() {
    const generoSeleccionado = document.getElementById('filtro-genero').value;
    
    // Si no se ha seleccionado un género, mostramos todas las películas
    if (!generoSeleccionado) {
        mostrarPeliculas(peliculas);  // Mostrar todas las películas
        return;
    }

    // Filtramos las películas por el género seleccionado
    const peliculasFiltradas = peliculas.filter(pelicula => pelicula.genero === generoSeleccionado);
    mostrarPeliculas(peliculasFiltradas);  // Mostramos las películas filtradas
}
