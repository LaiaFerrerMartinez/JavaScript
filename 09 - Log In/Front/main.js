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
const trailerContainer = document.getElementById('seccion-trailer'); // Contenedor del trailer
const movieTitle = document.getElementById('movie-title'); // Título de la película
const movieYear = document.getElementById('movie-year'); // Año de la película
const movieGenre = document.getElementById('movie-genre'); // Género de la película
const movieSynopsis = document.getElementById('movie-synopsis'); // Sinopsis de la película
const trailerVideo = document.getElementById('trailer-video'); // Reproductor de video

let peliculas = [];
let peliculasFiltradas = [];
let peliculasFavoritasFiltradas = []; // Guardar las favoritas filtradas

// Recuperar el userId desde localStorage y asegurarse de que es un número entero
const userId = localStorage.getItem('userId');

if (isNaN(userId)) {
    console.error('El userId no es un número válido');
} else {
    console.log('Usuario autenticado con ID:', userId);
}

function inicializar() {
    fetch('http://localhost:3000/peliculas')
    .then(response => response.json())
    .then(data => {
        peliculas = data;
        peliculasFiltradas = [...peliculas];
        mostrarPeliculas(peliculasFiltradas);
        cargarGeneros();
        generarBotonesAcceso();
    })
    .catch(error => console.error('Error:', error));

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
        const corazonClass = esFavorita ? "fas fa-heart" : "far fa-heart";
        const corazonStyle = esFavorita 
            ? "background-color: #1c1c2c; color: white; font-size:24px" 
            : "background-color: #1c1c2c; color: white; font-size:24px";

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
                    <div class="ver-trailer-container"><a href="#seccion-trailer">
                        <button class="ver-trailer" data-pelicula-id="${pelicula.pelicula_id}">Ver Trailer</button>
                        </a>
                    </div>
                    <div class="favoritos-container">
                        <button class="favorito-btn" data-pelicula-id="${pelicula.pelicula_id}">
                            <i class="${corazonClass}" style="${corazonStyle}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        listadoPeliculas.appendChild(li);
    });

    document.querySelectorAll('.favorito-btn').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const peliculaId = event.target.closest('button').getAttribute('data-pelicula-id');
            const esFavorita = peliculasFavoritasFiltradas.some(p => p.pelicula_id == peliculaId);

            if (esFavorita) {
                eliminarDeFavoritos(peliculaId);
            } else {
                agregarAFavoritos(peliculaId);
            }
        });
    });

    document.querySelectorAll('.ver-trailer').forEach(boton => {
        boton.addEventListener('click', (event) => {
            const peliculaId = event.target.getAttribute('data-pelicula-id');
            mostrarTrailer(peliculaId);
        });
    });
}

function mostrarTrailer(peliculaId) {
    const pelicula = peliculas.find(p => p.pelicula_id == peliculaId);
    if (pelicula) {
        trailerVideo.src = `Trailers/${pelicula.trailer_archivo}`; // Cargar desde archivo local
        movieTitle.textContent = pelicula.pelicula_titulo;
        movieYear.textContent = pelicula.pelicula_anio;
        movieGenre.textContent = pelicula.genero_titulo;
        movieSynopsis.textContent = pelicula.pelicula_descripcion;
        trailerContainer.style.display = 'block'; // Hacer visible el contenedor del trailer
    } else {
        trailerContainer.style.display = 'none'; // Ocultar el trailer si no se encuentra la película
        console.error('Pelicula no encontrada');
    }
}

function agregarAFavoritos(peliculaId) {
    fetch('http://localhost:3000/favoritos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: userId, pelicula_id: peliculaId })
    })
    .then(response => response.json())
    .then(() => {
        cargarFavoritos();
    })
    .catch(error => {
        console.error('Error al añadir a favoritos:', error);
        alert("Hubo un error al añadir a favoritos.");
    });
}

function cargarFavoritos() {
    fetch(`http://localhost:3000/favoritos/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Favoritos cargados:", data); // 🔍 Debugging
            peliculasFavoritasFiltradas = Array.isArray(data) ? data : [];

            if (filtrarFavoritosBtn.classList.contains("activo")) {
                mostrarPeliculas(peliculasFavoritasFiltradas);
            } else {
                mostrarPeliculas(peliculasFiltradas.length > 0 ? peliculasFiltradas : peliculas);
            }
        })
        .catch(error => {
            console.error('Error al cargar favoritos:', error);
            mostrarPeliculas(peliculasFiltradas.length > 0 ? peliculasFiltradas : peliculas);
        });
}

function eliminarDeFavoritos(peliculaId) {
    fetch('http://localhost:3000/favoritos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: userId, pelicula_id: peliculaId })
    })
    .then(response => response.json())
    .then(() => {
        cargarFavoritos();  // Recargar la lista de favoritos inmediatamente
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
        peliculasFiltradas = peliculas.filter(pelicula => pelicula.genero_titulo === genero);
    }
    mostrarPeliculas(peliculasFiltradas);
}

function filtrarPeliculasSaga(saga) {
    const peliculasFiltradasPorSaga = peliculas.filter(pelicula => pelicula.saga_nombre === saga);
    mostrarPeliculas(peliculasFiltradasPorSaga);
}

function buscarPorTitulo() {
    const query = buscarInput.value.toLowerCase();
    const peliculasEncontradas = peliculas.filter(pelicula =>
        pelicula.pelicula_titulo.toLowerCase().includes(query)
    );
    mostrarPeliculas(peliculasEncontradas);
}

// Ordenar películas por año
function ordenarPeliculas(ascendente = true) {
    peliculasFiltradas.sort((a, b) => (ascendente ? a.pelicula_anio - b.pelicula_anio : b.pelicula_anio - a.pelicula_anio));
    mostrarPeliculas(peliculasFiltradas);
}

document.getElementById('volverLogin').addEventListener('click', function(event) {
    window.location.href = 'login.html'; // Redirigir al perfil
});

filtrarFavoritosBtn.addEventListener("click", () => {
    filtrarFavoritosBtn.classList.toggle("activo");
    cargarFavoritos();
});

buscarBtn.addEventListener("click", buscarPorTitulo);
ordenarAscBtn.addEventListener("click", () => ordenarPeliculas(true));
ordenarDescBtn.addEventListener("click", () => ordenarPeliculas(false));

inicializar();
