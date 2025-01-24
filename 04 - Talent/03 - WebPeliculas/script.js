// Referencias al DOM
const listadoPeliculas = document.getElementById("peliculas");
const generoSelect = document.getElementById("genero");
const accesosRapidos = document.getElementById("accesos-rapidos");

let peliculas = []; // Aquí guardaremos las películas cargadas desde el archivo JSON

// Inicializar la página
function inicializar() {
    cargarPeliculas();
}

// Cargar las películas desde el archivo JSON
function cargarPeliculas() {
    fetch('peliculas.json') // Suponiendo que el archivo JSON está en el mismo directorio que tu HTML
        .then(response => response.json())
        .then(data => {
            peliculas = data;
            cargarGeneros();
            mostrarPeliculas(peliculas);
            generarBotonesAcceso();
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Cargar géneros en el desplegable
function cargarGeneros() {
    // Obtener los géneros únicos de las películas sin incluir "todos"
    const generos = [...new Set(peliculas.map(p => p.genero))];

    // Añadir los géneros al select
    generos.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero;
        option.textContent = genero;
        generoSelect.appendChild(option);
    });

    // Añadir el evento para filtrar las películas
    generoSelect.addEventListener("change", filtrarPeliculas);
}

// Generar botones de acceso rápido
function generarBotonesAcceso() {
    const generos = [...new Set(peliculas.map(p => p.genero))];
    generos.forEach(genero => {
        const button = document.createElement("button");
        button.textContent = genero;
        button.addEventListener("click", () => filtrarPeliculasPorGenero(genero));
        accesosRapidos.appendChild(button);
    });
}

// Mostrar películas en la página
function mostrarPeliculas(lista) {
    listadoPeliculas.innerHTML = ""; // Limpiar el listado
    lista.forEach(pelicula => {
        const li = document.createElement("li");
        li.textContent = `${pelicula.titulo} - ${pelicula.genero} (${pelicula.año})`;
        listadoPeliculas.appendChild(li);
    });
}

// Filtrar películas por género desde el desplegable
function filtrarPeliculas() {
    const generoSeleccionado = generoSelect.value;
    if (generoSeleccionado === "todos") {
        mostrarPeliculas(peliculas);
    } else {
        const filtradas = peliculas.filter(p => p.genero === generoSeleccionado);
        mostrarPeliculas(filtradas);
    }
}

// Filtrar películas por género usando botones
function filtrarPeliculasPorGenero(genero) {
    const filtradas = peliculas.filter(p => p.genero === genero);
    mostrarPeliculas(filtradas);
}

// Inicializar la aplicación
inicializar();
