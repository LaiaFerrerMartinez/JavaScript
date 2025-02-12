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
// Recuperar el userId desde localStorage y asegurarse de que es un número entero
console.log(localStorage);
const userId = localStorage.getItem('userId');

if (isNaN(userId)) {
    console.error('El userId no es un número válido');
    console.log(userId);
    // Aquí puedes hacer algo, por ejemplo, redirigir al login o mostrar un mensaje de error.
} else {
    // Continuar con la lógica
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
    ? "background-color: #1c1c2c; color: white; padding: 5px; font-size:24px" 
    : "background-color: #1c1c2c; color: white; padding: 5px; font-size:24px";


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
                    <button class="favorito-btn" data-pelicula-id="${pelicula.pelicula_id}" style="background-color: black; border: none;">
    <i class="${corazonClass}" style="${corazonStyle}"></i>
</button>

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

            // 🔥 Solo mostrar favoritos si el botón está activado
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

function actualizarVistaPeliculas() {
    const contenedorMensaje = document.getElementById("contenedorMensaje");
    
    if (filtrarFavoritosBtn.classList.contains("activo")) {
        if (peliculasFavoritasFiltradas.length > 0) {
            mostrarPeliculas(peliculasFavoritasFiltradas);
            contenedorMensaje.innerHTML = '';  // Limpiar mensaje
        } else {
            contenedorMensaje.innerHTML = 'No tienes ninguna película en favoritos.';
            listadoPeliculas.innerHTML = '';  // Limpiar listado de películas
        }
    } else {
        // 🔴 SOLUCIÓN: Mostramos todas las películas cuando NO se filtran favoritos
        if (peliculasFiltradas.length > 0) {
            mostrarPeliculas(peliculasFiltradas);
            contenedorMensaje.innerHTML = '';  // Limpiar mensaje
        } else if (peliculas.length > 0) {
            mostrarPeliculas(peliculas);
            contenedorMensaje.innerHTML = '';  // Limpiar mensaje
        } else {
            contenedorMensaje.innerHTML = 'No hay películas disponibles.';
            listadoPeliculas.innerHTML = '';  // Limpiar listado de películas
        }
    }
}


filtrarFavoritosBtn.addEventListener("click", () => {
    filtrarFavoritosBtn.classList.toggle("activo");
    actualizarVistaPeliculas(); // Llamamos a la función que gestiona qué películas mostrar
});



buscarBtn.addEventListener("click", buscarPorTitulo);
ordenarAscBtn.addEventListener("click", () => ordenarPeliculas(true));
ordenarDescBtn.addEventListener("click", () => ordenarPeliculas(false));

inicializar();
