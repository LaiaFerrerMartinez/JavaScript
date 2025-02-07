// Referencias al DOM
const listadoPeliculas = document.getElementById("peliculas");
const generoSelect = document.getElementById("genero");
const accesosRapidos = document.getElementById("accesos-rapidos");
const buscarInput = document.getElementById("buscar");
const buscarBtn = document.getElementById("buscar-button");
const ordenarAscBtn = document.getElementById("ordenar-ascendente");
const ordenarDescBtn = document.getElementById("ordenar-descendente");
const peliculasFavoritas = document.getElementById("peliculas-favoritas");
const filtrarFavoritosBtn = document.getElementById("filtrar-favoritos");

let peliculas = [];
let peliculasFiltradas = [];
let peliculasFavoritasFiltradas = []; // Guardar las favoritas filtradas
const usuarioId = 1; // Cambiar esto por el ID del usuario autenticado

// Función principal para cargar datos y configurar la página
function inicializar() {
    fetch('http://localhost:3000/peliculas')  // Asegúrate de que esta URL es la correcta
    .then(response => response.json())
    .then(data => {
        peliculas = data;
        peliculasFiltradas = [...peliculas];
        mostrarPeliculas(peliculasFiltradas);
        cargarGeneros();
        generarBotonesAcceso();
    })
    .catch(error => console.error('Error:', error));

    // Cargar favoritos del usuario
    cargarFavoritos();
}

function cargarGeneros() {
    generoSelect.innerHTML = '<option value="todos">Todos</option>';
    const generos = [...new Set(peliculas.map(p => p.genero_titulo))];

    generos.forEach(genero => {
        const option = document.createElement("option");
        option.value = genero;
        option.textContent = genero;
        generoSelect.appendChild(option);
    });

    generoSelect.addEventListener("change", () => filtrarPeliculas(generoSelect.value));
}

function generarBotonesAcceso() {
    accesosRapidos.innerHTML = "";
    const sagas = [...new Set(peliculas.map(p => p.saga_nombre))];

    sagas.forEach(saga => {
        if (saga !== null && saga !== undefined) {
            const button = document.createElement("button");
            button.textContent = saga;
            button.addEventListener("click", () => filtrarPeliculasSaga(saga));
            accesosRapidos.appendChild(button);
        }
    });
}

function mostrarPeliculas(lista) {
    listadoPeliculas.innerHTML = "";
    if (lista.length === 0) {
        listadoPeliculas.innerHTML = "<li>No se encontraron películas.</li>";
        return;
    }

    lista.forEach(pelicula => {
        const li = document.createElement("li");
        const esFavorita = peliculasFavoritasFiltradas.some(p => p.pelicula_id === pelicula.pelicula_id);

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
                    <button class="favorito-btn" data-pelicula-id="${pelicula.pelicula_id}">
                        ${esFavorita ? "Eliminar de favoritos" : "Añadir a favoritos"}
                    </button>
                </div>
            </div>
        `;
        listadoPeliculas.appendChild(li);
    });

    const botonesFavoritos = document.querySelectorAll('.favorito-btn');
    botonesFavoritos.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const peliculaId = event.target.getAttribute('data-pelicula-id');
            if (event.target.textContent === "Añadir a favoritos") {
                agregarAFavoritos(peliculaId);
            } else {
                eliminarDeFavoritos(peliculaId);
            }
        });
    });
}

function agregarAFavoritos(peliculaId) {
    fetch('http://localhost:3000/favoritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: usuarioId, pelicula_id: peliculaId })
    })
    .then(response => response.json())
    .then(data => {
        alert("Película añadida a favoritos!");
        cargarFavoritos(); // Recargar los favoritos
    })
    .catch(error => {
        console.error('Error al añadir a favoritos:', error);
        alert("Hubo un error al añadir a favoritos.");
    });
}

function cargarFavoritos() {
    fetch(`http://localhost:3000/favoritos/${usuarioId}`)
    .then(response => response.json())
    .then(data => {
        peliculasFavoritasFiltradas = data; // Guardar las películas favoritas
        mostrarPeliculas(peliculasFiltradas); // Mostrar todas las películas inicialmente
    })
    .catch(error => console.error('Error al cargar favoritos:', error));
}

function mostrarFavoritos(favoritos) {
    peliculasFavoritas.innerHTML = "";
    favoritos.forEach(pelicula => {
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
                    <button class="eliminar-favorito-btn" data-pelicula-id="${pelicula.pelicula_id}">Eliminar de favoritos</button>
                </div>
            </div>
        `;
        peliculasFavoritas.appendChild(li);
    });

    const botonesEliminarFavorito = document.querySelectorAll('.eliminar-favorito-btn');
    botonesEliminarFavorito.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const peliculaId = event.target.getAttribute('data-pelicula-id');
            eliminarDeFavoritos(peliculaId);
        });
    });
}

function eliminarDeFavoritos(peliculaId) {
    fetch('http://localhost:3000/favoritos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: usuarioId, pelicula_id: peliculaId })
    })
    .then(response => response.json())
    .then(data => {
        alert("Película eliminada de favoritos.");
        cargarFavoritos(); // Recargar los favoritos
    })
    .catch(error => {
        console.error('Error al eliminar de favoritos:', error);
        alert("Hubo un error al eliminar de favoritos.");
    });
}

function filtrarPeliculas(genero) {
    if (genero === "todos") {
        peliculasFiltradas = [...peliculas];
    } else {
        peliculasFiltradas = peliculas.filter(p => p.genero_titulo === genero);
    }
    mostrarPeliculas(peliculasFiltradas);
}

function filtrarPeliculasSaga(saga) {
    peliculasFiltradas = peliculas.filter(p => p.saga_nombre === saga);
    mostrarPeliculas(peliculasFiltradas);
}

function buscarPorTitulo() {
    const textoBusqueda = buscarInput.value.toLowerCase().trim();
    peliculasFiltradas = peliculas.filter(p =>
        p.pelicula_titulo.toLowerCase().includes(textoBusqueda)
    );
    mostrarPeliculas(peliculasFiltradas);
}

function ordenarPeliculas(ascendente = true) {
    peliculasFiltradas.sort((a, b) => (ascendente ? a.pelicula_anio - b.pelicula_anio : b.pelicula_anio - a.pelicula_anio));
    mostrarPeliculas(peliculasFiltradas);
}

// Función para mostrar solo películas favoritas
filtrarFavoritosBtn.addEventListener("click", () => {
    mostrarPeliculas(peliculasFavoritasFiltradas); // Filtra y muestra solo las favoritas
});

buscarBtn.addEventListener("click", buscarPorTitulo);
ordenarAscBtn.addEventListener("click", () => ordenarPeliculas(true));
ordenarDescBtn.addEventListener("click", () => ordenarPeliculas(false));

inicializar();
