// Referencias al DOM
const listadoPeliculas = document.getElementById("peliculas");
const generoSelect = document.getElementById("genero");
const accesosRapidos = document.getElementById("accesos-rapidos");
const buscarInput = document.getElementById("buscar");
const buscarBtn = document.getElementById("buscar-button");
const ordenarAscBtn = document.getElementById("ordenar-ascendente");
const ordenarDescBtn = document.getElementById("ordenar-descendente");

// Variables para almacenar las películas
let peliculas = [];
let peliculasFiltradas = [];

// Función principal para cargar datos y configurar la página
function inicializar() {
    fetch('http://localhost:3001/peliculas')  // Asegúrate de que esta URL es la correcta
    .then(response => response.json())
    .then(data => {
        peliculas = data;  // Guardamos las películas obtenidas de la API
        peliculasFiltradas = [...peliculas];  // Inicializamos las películas filtradas
        mostrarPeliculas(peliculasFiltradas);  // Mostramos las películas al cargar
        cargarGeneros();  // Cargamos los géneros en el desplegable
        generarBotonesAcceso();  // Creamos los botones rápidos para filtrar por saga
    })
    .catch(error => console.error('Error:', error));
}

// Cargar géneros únicos en el desplegable
function cargarGeneros() {
    generoSelect.innerHTML = '<option value="todos">Todos</option>'; // Limpiar y añadir opción "Todos"
    const generos = [...new Set(peliculas.map(p => p.genero_titulo))];  // Asumiendo que el campo es 'genero_titulo'

    // Añadir opciones al <select>
    generos.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero;
        option.textContent = genero;
        generoSelect.appendChild(option);
    });

    // Para filtrar por género desde el desplegable
    generoSelect.addEventListener("change", () => filtrarPeliculas(generoSelect.value));
}

// Generar botones rápidos para filtrar por saga
function generarBotonesAcceso() {
    accesosRapidos.innerHTML = ""; // Limpiar botones previos
    const sagas = [...new Set(peliculas.map(p => p.saga_nombre))];  // Usamos 'saga_nombre'

    // Crear un botón para cada saga
    sagas.forEach(saga => {
        // Solo crear el botón si la saga no es null ni undefined
        if (saga !== null && saga !== undefined) {
            const button = document.createElement("button");
            button.textContent = saga;
            // Cambiar a la función filtrarPeliculasSaga para que filtre por saga
            button.addEventListener("click", () => filtrarPeliculasSaga(saga));
            accesosRapidos.appendChild(button);
        }
    });
}

// Mostrar películas en la lista
function mostrarPeliculas(lista) {
    listadoPeliculas.innerHTML = ""; // Limpiar listado previo

    if (lista.length === 0) {
        listadoPeliculas.innerHTML = "<li>No se encontraron películas.</li>";
        return;
    }

    lista.forEach(pelicula => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="pelicula-contenedor">
                <div class="pelicula-imagen">
                    <img src="${pelicula.pelicula_imagen_url}" alt="${pelicula.pelicula_titulo}">
                </div>
                <div class="pelicula-detalles">
                    <h2>${pelicula.pelicula_titulo}</h2>
                    <p>Género: ${pelicula.genero_titulo}</p>
                    <p>Año: ${pelicula.pelicula_anio}</p>
                    <p>Descripción: ${pelicula.pelicula_descripcion}</p>
                    <p>Saga: ${pelicula.saga_nombre || 'No aplica'}</p>
                    <p>Director: ${pelicula.director_nombre || 'Desconocido'}</p>
                </div>
            </div>
        `;
        listadoPeliculas.appendChild(li);
    });
}

// Filtrar películas por género
function filtrarPeliculas(genero) {
    if (genero === "todos") {
        peliculasFiltradas = [...peliculas];
    } else {
        peliculasFiltradas = peliculas.filter(p => p.genero_titulo === genero);
    }
    mostrarPeliculas(peliculasFiltradas);
}

// Filtrar películas por saga
function filtrarPeliculasSaga(saga) {
    peliculasFiltradas = peliculas.filter(p => p.saga_nombre === saga);
    mostrarPeliculas(peliculasFiltradas);
}

// Buscar películas por título
function buscarPorTitulo() {
    const textoBusqueda = buscarInput.value.toLowerCase().trim();
    peliculasFiltradas = peliculas.filter(p =>
        p.pelicula_titulo.toLowerCase().includes(textoBusqueda)
    );
    mostrarPeliculas(peliculasFiltradas);
}

// Ordenar películas por año
function ordenarPeliculas(ascendente = true) {
    peliculasFiltradas.sort((a, b) => (ascendente ? a.pelicula_anio - b.pelicula_anio : b.pelicula_anio - a.pelicula_anio));
    mostrarPeliculas(peliculasFiltradas);
}

// Eventos para los botones
buscarBtn.addEventListener("click", buscarPorTitulo);
ordenarAscBtn.addEventListener("click", () => ordenarPeliculas(true));
ordenarDescBtn.addEventListener("click", () => ordenarPeliculas(false));

// Inicializar la aplicación
inicializar();
