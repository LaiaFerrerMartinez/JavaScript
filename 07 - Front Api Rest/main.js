const API_URL = "http://127.0.0.1:3000";
const GET_PELICULAS = API_URL + "/peliculas";
const GET_PELICULAS_BYGENERO = API_URL + "";
const GET_PELICULAS_FAVORITAS = API_URL + "";
const INSERT_PELICULAS = API_URL + "";
const GET_USUARIOS = API_URL + "/usuarios/:id";

function getPeliculas() {
    alert("PASO 1");
    /*fetch()
        .then()
        .then(
            (data) => {
                
            }
        )
        .catch() */
    fetch(GET_PELICULAS)  // http://127.0.0.1:3000/peliculas
        .then(response => response.json())
        .then(
            (data) => {
                let idPelicula = data[0].id;
                let tituloPelicula = data[0].titulo;
                let directorPelicula = data[0].director;
                let anioPelicula = data[0].anio;
                let generoPelicula = data[0].genero;
            }
        )
        .catch()    
}