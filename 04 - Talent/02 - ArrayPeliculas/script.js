// Referencias a elementos del DOM
const contenedorPeliculas = document.getElementById('contenedor-peliculas');
const contenedorTitulos = document.getElementById('contenedor-titulos');
const botonMostrarTitulos = document.getElementById('mostrar-titulos');
const inputGenero = document.getElementById('generoSeleccionado'); // Campo de texto para el género

// Cargar el JSON y mostrar las películas
fetch('peliculas.json')
  .then((response) => response.json())
  .then((data) => {
    // Guardar el JSON en una variable global para reutilizar
    window.peliculas = data;

    // Mostrar todas las películas inicialmente
    mostrarPeliculas(data);
  })
  .catch((error) => {
    console.error('Error al cargar el archivo JSON:', error);
  });

// Mostrar solo los títulos de las películas
botonMostrarTitulos.addEventListener('click', () => {
  if (!window.peliculas) return;

  let htmlContent = '';
  for (let i = 0; i < window.peliculas.length; i++) {
    htmlContent += `<p>${window.peliculas[i].titulo}</p>`;
  }
  contenedorTitulos.innerHTML = htmlContent;
});

// Función para mostrar las películas en la pantalla
function mostrarPeliculas(peliculasFiltradas) {
    let htmlContent = '';
    // Si no hay películas para mostrar, mostramos un mensaje
    if (peliculasFiltradas.length === 0) {
        htmlContent = '<p>No se encontraron películas con ese género.</p>';
    } else {
        // Mostrar todas las películas
        peliculasFiltradas.forEach(pelicula => {
            htmlContent += `
              <p><strong>${pelicula.titulo}</strong> - Año: ${pelicula.anio}, Género: ${pelicula.genero}</p>
            `;
        });
    }

    // Actualizar el contenedor con las películas filtradas
    contenedorPeliculas.innerHTML = htmlContent;
}

// Función para filtrar las películas por género
function filtrarPorGenero() {
    const generoSeleccionado = inputGenero.value.trim().toLowerCase(); // Obtener el género escrito y convertirlo a minúsculas
    
    // Si no se ha ingresado un género, mostramos todas las películas
    if (!generoSeleccionado) {
        mostrarPeliculas(window.peliculas);  // Mostrar todas las películas
        return;
    }

    // Filtramos las películas por el género ingresado
    const peliculasFiltradas = window.peliculas.filter(pelicula => 
        pelicula.genero.toLowerCase().includes(generoSeleccionado) // Compara sin importar mayúsculas/minúsculas
    );
    
    // Mostrar las películas filtradas
    mostrarPeliculas(peliculasFiltradas);  
}
