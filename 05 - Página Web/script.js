document.addEventListener("DOMContentLoaded", () => {
    // Guardar las películas cargadas
    let peliculas = [];

    // Función para cargar las películas desde el archivo JSON
    async function cargarPeliculas() {
        try {
            const response = await fetch('peliculas.json');  // Cargar el archivo JSON
            peliculas = await response.json();                // Convertir la respuesta a JSON
            mostrarPeliculas(peliculas);                       // Mostrar las películas
        } catch (error) {
            console.error('Error al cargar las películas:', error);
        }
    }

    // Función para mostrar las películas en la página
    function mostrarPeliculas(peliculas) {
        const movieList = document.getElementById("movieList");
        movieList.innerHTML = ""; // Limpiar la lista de películas

        peliculas.forEach(pelicula => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");

            // Contenido de la película (imagen + información)
            movieItem.innerHTML = `
                <img src="${pelicula.poster}" alt="${pelicula.titulo}">
                <div class="movie-info">
                    <h3>${pelicula.titulo}</h3>
                    <p class="genre">${pelicula.genero}</p>
                    <p class="year">${pelicula.año}</p>
                </div>
            `;
            
            movieList.appendChild(movieItem);
        });

        // Mostrar el mensaje de "No hay resultados" si no hay películas que coincidan
        const noResults = document.getElementById("noResults");
        if (peliculas.length === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

    // Filtrar por género usando botones
    const btnFiltros = document.querySelectorAll(".btnFiltro");
    btnFiltros.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const generoSeleccionado = e.target.getAttribute("data-genero");

            if (generoSeleccionado) {
                const peliculasFiltradas = peliculas.filter(pelicula =>
                    pelicula.genero === generoSeleccionado
                );
                mostrarPeliculas(peliculasFiltradas);
            }
        });
    });

    // Filtro de búsqueda por título
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("search");
    searchBtn.addEventListener("click", () => {
        const terminoBusqueda = searchInput.value.toLowerCase();
        const peliculasBuscadas = peliculas.filter(pelicula =>
            pelicula.titulo.toLowerCase().includes(terminoBusqueda)
        );
        mostrarPeliculas(peliculasBuscadas);
    });

    // Filtrar por género seleccionado en el dropdown
    const generoSelect = document.getElementById("generoSelect");
    generoSelect.addEventListener("change", (e) => {
        const generoSeleccionado = e.target.value;
        if (generoSeleccionado) {
            const peliculasFiltradas = peliculas.filter(pelicula =>
                pelicula.genero === generoSeleccionado
            );
            mostrarPeliculas(peliculasFiltradas);
        } else {
            mostrarPeliculas(peliculas); // Mostrar todas las películas si no hay filtro
        }
    });

    // Ordenar por año ascendente
    const sortAscBtn = document.getElementById("sortAsc");
    sortAscBtn.addEventListener("click", () => {
        const peliculasOrdenadasAsc = [...peliculas].sort((a, b) => a.año - b.año);
        mostrarPeliculas(peliculasOrdenadasAsc);
    });

    // Ordenar por año descendente
    const sortDescBtn = document.getElementById("sortDesc");
    sortDescBtn.addEventListener("click", () => {
        const peliculasOrdenadasDesc = [...peliculas].sort((a, b) => b.año - a.año);
        mostrarPeliculas(peliculasOrdenadasDesc);
    });

    // Cargar las películas al cargar la página
    cargarPeliculas();
});
